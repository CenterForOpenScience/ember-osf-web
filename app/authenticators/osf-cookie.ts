import { service } from '@ember-decorators/service';
import { warn } from '@ember/debug';
import { camelize } from '@ember/string';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import Base from 'ember-simple-auth/authenticators/base';
import Session from 'ember-simple-auth/services/session';

import { NotLoggedIn } from 'ember-osf-web/errors';
import CurrentUser from 'ember-osf-web/services/current-user';
import leafVals from 'ember-osf-web/utils/leaf-vals';
import { RootDocument } from 'osf-api';

const {
    OSF: {
        apiUrl,
        apiNamespace,
        apiVersion,
        devMode,
    },
    featureFlagNames,
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
        const url = `${apiUrl}/${apiNamespace}/`;
        let res: RootDocument = await this.currentUser.authenticatedAJAX(
            { url },
        );

        let userData = res.meta.current_user;
        const anonymizedViewOnly = Boolean(userData && userData.meta && userData.meta.anonymous);
        this.currentUser.setProperties({ anonymizedViewOnly });

        if (anonymizedViewOnly) {
            res = await this.currentUser.authenticatedAJAX(
                { url },
                { omitViewOnlyToken: true },
            );

            userData = res.meta.current_user;
        }

        if (Array.isArray(res.meta.active_flags)) {
            this.features.setup(
                res.meta.active_flags.reduce((acc, flag) => ({ ...acc, [flag]: true }), {}),
            );
        }

        // Initialize any uninitialized flags found in config.
        const flags: string[] = leafVals(featureFlagNames);
        flags.forEach(flag => {
            if (!this.features.flags.includes(camelize(flag))) {
                this.features.disable(flag);
            }
        });

        if (devMode) {
            this._checkApiVersion();
        }

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
            { omitStandardHeaders: true },
        );

        warn(
            `Using an old version of the OSF API! Current: ${res.meta.version}. Using: ${apiVersion}`,
            res.meta.version === apiVersion,
            { id: 'ember-osf-web.api-version-check' },
        );
    }
}
