import { service } from '@ember-decorators/service';
import { warn } from '@ember/debug';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import Base from 'ember-simple-auth/authenticators/base';
import Session from 'ember-simple-auth/services/session';

import { NotLoggedIn } from 'ember-osf-web/errors';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';

const {
    OSF: {
        apiUrl,
        apiNamespace,
        apiVersion,
        devMode,
    },
} = config;

interface ApiRootResponse {
    meta: {
        version: string,
        current_user: { data: { id: string } } | null, // eslint-disable-line camelcase
        active_flags: string[], // eslint-disable-line camelcase
    };
}

export default class OsfCookie extends Base {
    @service features!: Features;
    @service session!: Session;
    @service store!: DS.Store;

    /**
     * @method authenticate
     * @return {Promise}
     */
    async authenticate(): Promise<object> {
        const res: ApiRootResponse = await authenticatedAJAX({
            url: `${apiUrl}/${apiNamespace}/`,
        });

        if (devMode) {
            this._checkApiVersion();
        }

        if (Array.isArray(res.meta.active_flags)) {
            this.features.setup(
                res.meta.active_flags.reduce((acc, flag) => ({ ...acc, [flag]: true }), {}),
            );
        }

        const userData = res.meta.current_user;

        if (!userData) {
            throw new NotLoggedIn();
        }

        // Push the user into the store for later use
        this.store.pushPayload(userData);

        return { id: userData.data.id };
    }

    restore() {
        // Check for a valid auth cookie.
        // If it fails, the session will be invalidated.
        return this.authenticate();
    }

    async _checkApiVersion() {
        const res: ApiRootResponse = await authenticatedAJAX(
            {
                url: `${apiUrl}/${apiNamespace}/`,
                data: {
                    version: 'latest',
                },
            },
            false, // Don't add API version headers
        );

        warn(
            `Using an old version of the OSF API! Current: ${res.meta.version}. Using: ${apiVersion}`,
            res.meta.version === apiVersion,
            { id: 'ember-osf-web.api-version-check' },
        );
    }
}
