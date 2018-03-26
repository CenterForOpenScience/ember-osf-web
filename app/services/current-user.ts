import { computed } from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';
import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';
import { Promise as EmberPromise } from 'rsvp';

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

export default class CurrentUserService extends Service {
    store = service('store');
    session = service('session');
    features = service('features');
    waffleLoaded = false;

    /**
     * If logged in, return the ID of the current user, else return null.
     *
     * @property currentUserId
     * @type {String|null}
     */
    currentUserId = computed('session.data.authenticated', function(this: CurrentUserService): string|null {
        const session = this.get('session');
        if (session.get('isAuthenticated')) {
            return session.get('data.authenticated.id');
        } else {
            return null;
        }
    });

    /**
     * Return an observable promise proxy for the currently logged in user. If no user is logged in, resolves to null.
     *
     * TODO: Refactor to use a task, not a proxy object
     *
     * @property user
     * @return Promise proxy object that resolves to a user or null
     */
    user = computed('currentUserId', function(this: CurrentUserService) {
        const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
        return ObjectPromiseProxy.create({
            promise: this.load().catch(() => null),
        });
    });

    setWaffle = task(function* (this: CurrentUserService) {
        const url = `${config.OSF.apiUrl}/v2/_waffle/`;
        const { data } = yield authenticatedAJAX({
            url,
            method: 'GET',
        });
        for (const flag of data) {
            const { name, active } = flag.attributes;
            if (active) {
                this.get('features').enable(name);
            } else {
                this.get('features').disable(name);
            }
        }
        this.set('waffleLoaded', true);
    }).restartable();

    constructor() {
        super();
        this.get('session').on('authenticationSucceeded', this, function() {
            this.get('setWaffle').perform();
        });
        this.get('session').on('invalidationSucceeded', this, function() {
            this.get('setWaffle').perform();
        });
    }

    /**
     * Fetch information about the currently logged in user.
     * If no user is logged in, this method returns a rejected promise.
     *
     * @method load
     * @return {RSVP.Promise}
     */
    load(this: CurrentUserService) {
        return new EmberPromise((resolve, reject) => {
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
    }

    getWaffle(this: CurrentUserService, feature: string) {
        if (this.get('waffleLoaded')) {
            return Promise.resolve(this.get('features').isEnabled(feature));
        } else {
            if (this.get('setWaffle').isRunning) {
                return this.get('setWaffle').last.then(() => this.get('features').isEnabled(feature));
            }
            return this.get('setWaffle').perform().then(() => this.get('features').isEnabled(feature));
        }
    }
}

declare module 'ember' {
    interface ServiceRegistry {
        'current-user': CurrentUserService;
    }
}
