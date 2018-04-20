import config from 'ember-get-config';
import Base from 'ember-simple-auth/authenticators/base';
import $ from 'jquery';

const {
    OSF: {
        apiUrl,
        apiNamespace,
    },
} = config;

type AccessToken = string;

interface SessionData {
    attributes: {
        accessToken: AccessToken;
    };
}

/**
 * @module ember-osf-web
 * @submodule authenticators
 */

/**
 * Ember-simple-auth compatible authenticator based on OAuth2 bearer tokens.
 *
 * Intended to be used with the authorizer of the same name.
 */
export default class OsfToken extends Base {
    async authenticate(accessToken: AccessToken): Promise<any> {
        // Adds the entire API user endpoint record to the session store as given
        const { data } = await $.ajax({
            url: `${apiUrl}/${apiNamespace}/users/me/`,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: false,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return {
            ...data,
            attributes: {
                ...data.attributes,
                accessToken,
            },
        };
    }

    async restore(data: SessionData): Promise<any> {
        return this.authenticate(data.attributes.accessToken);
    }
}
