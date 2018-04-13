import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { get } from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';
import Service from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import User from 'ember-osf-web/models/user'; // eslint-disable-line no-unused-vars
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';
import RSVP from 'rsvp';

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
    @service store;
    @service session;
    @service features;

    waffleLoaded = false;

    /**
     * If logged in, return the ID of the current user, else return null.
     *
     * @property currentUserId
     * @type {String|null}
     */
    @computed('session.data.authenticated')
    get currentUserId(this: CurrentUserService): string | null {
        const session = this.get('session');

        if (session.get('isAuthenticated')) {
            return session.get('data.authenticated.id');
        }

        return null;
    }

    /**
     * Return an observable promise proxy for the currently logged in user. If no user is logged in, resolves to null.
     *
     * TODO: Refactor to use a task, not a proxy object
     *
     * @property user
     * @return Promise proxy object that resolves to a user or null
     */
    @computed('currentUserId')
    get user(this: CurrentUserService) {
        const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

        return ObjectPromiseProxy.create({
            promise: this.load(),
        });
    }

    setWaffle = task(function* (this: CurrentUserService) {
        const { data } = yield authenticatedAJAX({
            url: `${config.OSF.apiUrl}/v2/_waffle/`,
        });

        this.get('features').setup(
            data.reduce((acc, { attributes: { name, active } }) => ({ ...acc, [name]: active }), {}),
        );

        this.set('waffleLoaded', true);
    }).drop();

    constructor() {
        super();

        function performGetFlags(this: CurrentUserService) {
            this.get('setWaffle').perform();
        }

        const session = get(this, 'session');

        session.on('authenticationSucceeded', this, performGetFlags);
        session.on('invalidationSucceeded', this, performGetFlags);
    }

    load(this: CurrentUserService): RSVP.Promise<User | null> {
        const id = this.get('currentUserId');

        return id ? this.get('store').findRecord('user', id) : RSVP.resolve(null);
    }

    async getWaffle(this: CurrentUserService, feature: string): Promise<boolean> {
        const setWaffle = this.get('setWaffle');

        if (this.setWaffle.isRunning) {
            await this.setWaffle.last;
        } else if (!this.get('waffleLoaded')) {
            await setWaffle.perform();
        }

        return this.get('features').isEnabled(feature);
    }
}

declare module '@ember/service' {
    interface Registry {
        'current-user': CurrentUserService;
    }
}
