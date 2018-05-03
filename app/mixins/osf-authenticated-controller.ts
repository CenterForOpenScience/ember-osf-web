import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { getAuthUrl } from 'ember-osf-web/utils/auth';

/**
 * Controller mixin for authentication-agnostic login: defines the application at runtime to use the authentication
 * method specified in environment config. Intended to be used in tandem with OsfAuthController mixin.
 * Some authentication methods (eg cookies) are not available to third-party applications.
 * This has limited use, since most applications will only need to support one method. It may be useful for ember apps
 *   that run inside the OSF, eg to use the standalone dev server, or to offer support for branded apps
 *   on third-party domains.
 *
 * @class OsfAgnosticAuthController
 * @extends Ember.Mixin
 * @uses ember-osf-web/OsfCookieLoginController
 * @uses ember-osf-web/OsfTokenLoginController
 */
export default Mixin.create({
    session: service('session'),

    actions: {
        login() {
            window.location.href = getAuthUrl(window.location.href);
        },
    },
});
