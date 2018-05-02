import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import config from 'ember-get-config';
import { getTokenFromHash } from 'ember-osf-web/utils/auth';

const { Logger } = Ember;
const {
    authorizationType,
    OSF: {
        backend,
    },
} = config;

interface AuthRoute {
    session: any;
}

export default Mixin.create({
    session: service('session'),

    async beforeModel(...args: any[]) {
        await this._super(...args);

        const authArgs: string[] = [];

        switch (authorizationType) {
        case 'cookie':
            // Determine whether the user is logged in by making a test request. This is quite a crude way of
            // determining whether the user has a cookie and should be improved in the future.
            if (this.get('session').get('isAuthenticated')) {
                return;
            }

            break;
        case 'token': {
            let accessToken;

            if (backend === 'local') {
                ({ accessToken } = config.OSF);
            } else {
                accessToken = getTokenFromHash(window.location.hash);

                if (!accessToken) {
                    return null;
                }

                window.location.hash = '';
            }

            if (accessToken) {
                authArgs.push(accessToken);
            }
            break;
        }
        default:
            throw new Error(`Unrecognized authorization type: ${authorizationType}`);
        }

        // Block transition until auth attempt resolves. If auth fails, let the page load normally.
        try {
            return await this.get('session').authenticate(`authenticator:osf-${authorizationType}`, ...authArgs);
        } catch (e) {
            Logger.log('Authentication failed: ', e);
        }
    },
}) as Mixin<AuthRoute>;

/**
 * Route mixin for authentication-agnostic login: defines the application at runtime to use the authentication method
 *   specified in environment config. Intended to be used in tandem with OsfAgnosticAuthRoute mixin.
 * Some authentication methods (eg cookies) are not available to third-party applications.
 * This has limited use, since most applications will only need to support one method. It may be useful for ember apps
 *   that run inside the OSF, eg to use the standalone dev server, or to offer support for branded apps
 *   on third-party domains.
 *
 * @class OsfAgnosticAuthRoute
 * @extends Ember.Mixin
 * @uses ember-osf-web/OsfCookieLoginRoute
 * @uses ember-osf-web/OsfTokenLoginRoute
 */
// export default AuthMixin;
