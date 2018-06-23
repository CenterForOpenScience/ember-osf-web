import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Service from '@ember/service';
import { task, waitForProperty } from 'ember-concurrency';
import DS from 'ember-data';
import Features from 'ember-feature-flags';
import config from 'ember-get-config';
import Session from 'ember-simple-auth/services/session';
import RSVP from 'rsvp';

import User from 'ember-osf-web/models/user';

const {
    OSF: {
        url: osfUrl,
    },
} = config;

enum AuthRoute {
    Login = 'login',
    Logout = 'logout',
}

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
    @service store!: DS.Store;
    @service session!: Session;
    @service features!: Features;

    featuresLoaded = false;
    showTosConsentBanner = false;

    /**
     * If logged in, return the ID of the current user, else return undefined.
     */
    @alias('session.data.authenticated.id') currentUserId: string | undefined;

    /**
     * Return an observable promise proxy for the currently logged in user. If no user is logged in, resolves to null.
     */
    @computed('currentUserId')
    get user(this: CurrentUserService): User | null {
        if (this.currentUserId) {
            // The authenticator should have pushed the user into the store
            return this.store.peekRecord('user', this.currentUserId);
        }
        return null;
    }

    /**
     * Task to wait for features to be loaded.
     */
    featuresAreLoadedTask = task(function *(this: CurrentUserService) {
        yield waitForProperty(this, 'featuresLoaded');
    });

    constructor() {
        super();
        this.session.on('invalidationSucceeded', this, this.logout);
    }

    /**
     * Send the user to a login page, which will redirect to the given URL (or back to the current page)
     * when successfully logged in.
     * Returns a promise that never resolves.
     */
    async login(nextUrl?: string) {
        return this._authRedirect(AuthRoute.Login, nextUrl);
    }

    /**
     * Invalidate the current session and cookie, then redirect to the given URL (or back to the current page).
     * Returns a promise that never resolves.
     */
    async logout(this: CurrentUserService, nextUrl?: string) {
        if (this.session.isAuthenticated) {
            await this.session.invalidate();
        }
        return this._authRedirect(AuthRoute.Logout, nextUrl);
    }

    _authRedirect(authRoute: AuthRoute, nextUrl?: string) {
        const next = encodeURIComponent(nextUrl || window.location.href);
        window.location.href = `${osfUrl}${authRoute}/?next=${next}`;
        return new RSVP.Promise(() => { /* never resolve, just wait for the redirect */ });
    }

    async checkShowTosConsentBanner(this: CurrentUserService) {
        const user = await this.user;
        if (user && !user.acceptedTermsOfService) {
            // Unset to avoid premature validation.
            user.set('acceptedTermsOfService', undefined);
            this.set('showTosConsentBanner', true);
        }
    }

    /**
     * Set features from a list of active flags.
     */
    setFeatures(this: CurrentUserService, activeFlags: string[]) {
        if (activeFlags) {
            this.features.setup(
                activeFlags.reduce((acc: object, flag) => ({ ...acc, [flag]: true }), {}),
            );
            this.set('featuresLoaded', true);
        }
    }

    /**
     * Task wrapper function that will resolve when features are loaded.
     */
    featuresAreLoaded(this: CurrentUserService) {
        return this.get('featuresAreLoadedTask').perform();
    }
}

declare module '@ember/service' {
    interface Registry {
        'current-user': CurrentUserService;
    }
}
