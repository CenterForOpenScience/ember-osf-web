import Ember from 'ember';
import config from 'ember-get-config';

import OsfTokenLoginRoute from '../mixins/osf-token-login-route';
import OsfCookieLoginRoute from '../mixins/osf-cookie-login-route';

/**
 * @module ember-osf-web
 * @submodule mixins
 */
const authType = config.authorizationType;
if (authType !== 'token' && authType !== 'cookie') {
    throw new Ember.Error(`Unrecognized authorization type: ${authType}`);
}

const AuthMixin = authType === 'token' ? OsfTokenLoginRoute : OsfCookieLoginRoute;
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
export default AuthMixin;
