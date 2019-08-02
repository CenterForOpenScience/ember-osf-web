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
import { addQueryParam } from 'ember-osf-web/utils/url-parts';

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

function hashCode(str: string): number {
    return str
        .split('')
        // eslint-disable-next-line no-bitwise
        .reduce((acc, _, i) => ((acc << 5) - acc) + str.charCodeAt(i), 0); // tslint:disable-line no-bitwise
}

export interface OsfAjaxOptions {
    omitStandardHeaders: boolean;
    omitViewOnlyToken: boolean;
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

    viewOnlyToken: string = '';
    anonymizedViewOnly: boolean = false;

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
        ajaxOptions: JQuery.AjaxSettings,
        osfOptions: Partial<OsfAjaxOptions> = {},
    ): Promise<any> {
        const opts = { ...ajaxOptions };

        if (!osfOptions.omitViewOnlyToken && this.viewOnlyToken) {
            opts.url = addQueryParam(opts.url!, 'view_only', this.viewOnlyToken);
        }

        if (!osfOptions.omitStandardHeaders) {
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

    /**
     * Return a simple hash of the currentUser ID if user is logged in, otherwise return a generated random string.
     * sessionKey can be used to identify the current session or any general purposes.
     * For Elasticsearch requests, sessionKey is used as the "preference" URL parameter to ensure reproducible search
     * results ordering.
     *
     * @property sessionKey
     * @return {String}
     */
    @computed('currentUserId')
    get sessionKey(): string {
        return this.currentUserId ?
            hashCode(this.currentUserId).toString() :
            Math.random().toString(36).substr(2, 10);
    }
}

declare module '@ember/service' {
    interface Registry {
        'current-user': CurrentUserService;
    }
}
