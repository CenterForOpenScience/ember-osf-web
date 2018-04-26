import { service } from '@ember-decorators/service';
import DS from 'ember-data';
import config from 'ember-get-config';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';
import Base from 'ember-simple-auth/authenticators/base';
import Session from 'ember-simple-auth/services/session';

const {
    OSF: {
        apiUrl,
        apiNamespace,
    },
} = config;

interface SessionData {
    id: any;
    status: number; // eslint-disable-line no-restricted-globals
}

export default class OsfCookie extends Base {
    @service session!: Session;
    @service store!: DS.Store;

    /**
     * For now, simply verify that a token is present and can be used
     * @method authenticate
     * @return {Promise}
     */
    async authenticate(this: OsfCookie): Promise<object> {
        const res = await authenticatedAJAX({
            url: `${apiUrl}/${apiNamespace}/users/me/`,
            dataType: 'json',
            contentType: 'application/json',
        }) as { data: object };
        // Push the result into the store for later use by the current-user service
        // Note: we have to deepcopy res because pushPayload mutates our data
        // and causes an infinite loop because reasons
        this.get('store').pushPayload({ ...res });

        return res.data;
    }

    /**
     * Send a request to the flask application to trigger invalidation of session remotely
     * @method invalidate
     */
    async invalidate(this: OsfCookie, data?: SessionData): Promise<any> {
        if (!data || (data.id && data.status !== 401)) {
            // If invalidate is called when loading the page to check if a cookie has permissions, don't redirect the
            // user. But if invalidate is called without arguments, or for any other reason, interpret this as a
            // straight logout request(and let the session get invalidated next time at the start of first page load)
            // Can't do this via AJAX request because it redirects to CAS, and AJAX + redirect = CORS issue

            // Manually clear session before user leaves the page, since we aren't sticking around for ESA to do so
            // later
            return this.get('session').get('session')._clear(true);
        }

        // This branch is expected to be called when a test request reveals the user to lack permissions... so
        // session should be wiped
    }

    async restore(this: OsfCookie, data: SessionData): Promise<any> {
        try {
            return await this.authenticate();
        } catch (e) {
            return this.invalidate(data);
        }
    }
}
