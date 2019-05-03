import { service } from '@ember-decorators/service';
import { warn } from '@ember/debug';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import Base from 'ember-simple-auth/authenticators/base';
import Session from 'ember-simple-auth/services/session';

import { NotLoggedIn } from 'ember-osf-web/errors';
import CurrentUser from 'ember-osf-web/services/current-user';
import { RootDocument } from 'osf-api';

const {
    OSF: {
        apiUrl,
        apiNamespace,
        apiVersion,
        devMode,
    },
    featureFlagNames: { ABTesting },
} = config;

export default class OsfCookie extends Base {
    @service features!: Features;
    @service session!: Session;
    @service store!: DS.Store;
    @service currentUser!: CurrentUser;

    /**
     * @method authenticate
     * @return {Promise}
     */
    async authenticate(): Promise<object> {
        const res: RootDocument = await this.currentUser.authenticatedAJAX({
            url: `${apiUrl}/${apiNamespace}/`,
        });

        if (Array.isArray(res.meta.active_flags)) {
            this.features.setup(
                res.meta.active_flags.reduce((acc, flag) => ({ ...acc, [flag]: true }), {}),
            );
        }

        //
        // TODO: create function to initialize all feature flags in config
        //
        if (!this.features.flags.includes(ABTesting.homePageVersionB)) {
            this.features.disable(ABTesting.homePageVersionB);
        }

        if (devMode) {
            this._checkApiVersion();
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
        const res: RootDocument = await this.currentUser.authenticatedAJAX(
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
