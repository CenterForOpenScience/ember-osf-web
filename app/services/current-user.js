import Ember from 'ember';
import config from 'ember-get-config';
import { task } from 'ember-concurrency';

/**
 * @module ember-osf-web
 * @submodule services
 */

/**
 * Access information about the currently logged in user
 *
 * @class current-user
 * @extends Ember.Service
 */
export default Ember.Service.extend({
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    features: Ember.inject.service(),

    /**
     * If logged in, return the ID of the current user, else return null.
     *
     * @property currentUserId
     * @type {String|null}
     */
    currentUserId: Ember.computed('session.data.authenticated', function() {
        const session = this.get('session');
        if (session.get('isAuthenticated')) {
            return session.get('data.authenticated.id');
        } else {
            return null;
        }
    }),

    /**
     * Fetch information about the currently logged in user. If no user is logged in, this method returns a rejected promise.
     * @method load
     * @return {Promise}
     */
    load() {
        return new Ember.RSVP.Promise((resolve, reject) => {
            const currentUserId = this.get('currentUserId');
            if (currentUserId) {
                const currentUser = this.get('store').peekRecord('user', currentUserId);
                if (currentUser) {
                    resolve(currentUser);
                } else {
                    this.get('store').findRecord('user', currentUserId).then(user => resolve(user), reject);
                }
            } else {
                reject();
            }
        });
    },

    /**
     * Return an observable promise proxy for the currently logged in user. If no user is logged in, resolves to null.
     *
     * @property user
     * @return Promise proxy object that resolves to a user or null
     */
    user: Ember.computed('currentUserId', function() {
        const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
        this.get('_setWaflle').perform();
        return ObjectPromiseProxy.create({
            promise: this.load().catch(() => null),
        });
    }),

    _setWaflle: task(function* () {
        const url = `${config.OSF.apiUrl}/v2/_waffle/`;
        const { data } = yield $.ajax(url, 'GET');
        for (const flag of data) {
            const { name } = flag.attributes;
            if (flag.attributes.active) {
                this.get('features').enable(name);
            } else {
                this.get('features').disable(name);
            }
        }
    }).restartable(),
});
