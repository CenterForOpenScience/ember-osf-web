import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Service from '@ember/service';
import Cookies from 'ember-cookies/services/cookies';
import DS from 'ember-data';
import config from 'ember-get-config';
import Session from 'ember-simple-auth/services/session';
import RSVP from 'rsvp';

import User from 'ember-osf-web/models/user';

const {
    OSF: {
        url: osfUrl,
        apiHeaders,
        cookies: {
            csrf: csrfCookie,
        },
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
    @service cookies!: Cookies;

    showTosConsentBanner = false;

    /**
     * If logged in, return the ID of the current user, else return undefined.
     */
    @alias('session.data.authenticated.id') currentUserId: string | undefined;

    /**
     * Return the currently logged-in user, or null if not logged in.
     */
    @computed('currentUserId')
    get user(this: CurrentUserService): User | null {
        if (this.currentUserId) {
            // The authenticator should have pushed the user into the store
            return this.store.peekRecord('user', this.currentUserId);
        }
        return null;
    }

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
     * Perform an AJAX request as the current user.
     */
    async authenticatedAJAX(
        options: JQuery.AjaxSettings,
        addApiHeaders: boolean = true,
    ): Promise<any> {
        const opts = { ...options };

        if (addApiHeaders) {
            opts.headers = {
                ...this.ajaxHeaders(),
                ...opts.headers,
            };
        }

        opts.xhrFields = {
            withCredentials: true,
            ...opts.xhrFields,
        };

        // Return RSVP.Promise so the callbacks are run within the current runloop
        return new RSVP.Promise((resolve, reject) => $.ajax(opts).then(resolve).catch(reject));
    }

    /**
     * Modify a given XMLHttpRequest to add the current user's authorization.
     */
    authorizeXHR(xhr: XMLHttpRequest, addApiHeaders: boolean = true): void {
        if (addApiHeaders) {
            Object.entries(this.ajaxHeaders()).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
        }
        xhr.withCredentials = true; // eslint-disable-line no-param-reassign
    }

    /**
     * Return headers that should be included with every AJAX request to the API
     */
    ajaxHeaders() {
        const headers = { ...apiHeaders };
        const csrfToken = this.cookies.read(csrfCookie);
        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }
        return headers;
    }
}

declare module '@ember/service' {
    interface Registry {
        'current-user': CurrentUserService;
    }
}
