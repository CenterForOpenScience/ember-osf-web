import EmberError from '@ember/error';
import config from 'ember-get-config';
import $ from 'jquery';

/**
 * @module ember-osf-web
 * @submodule utils
 */

/**
 * @class auth
 */

/**
 * Retrieve the correct URL for OAuth 2.0 authentication in the OSF, including any additional configurable parameters
 * @private
 * @method getOAuthUrl
 * @param {string} nextUri Where to send the browser after a successful login request
 * @return {string}
 */
function getOAuthUrl(nextUri) {
    // OAuth requires that redirect URI match what was registered, exactly. We may need a parameter to signify next
    //   transition, if the user wants to return to ember at the point where they left off before needing to log in.
    // For now, we will put this in the `state` parameter (always returned unchanged) and implement that in ember later.
    // To avoid abuse, the application should forcibly truncate state, eg make it relative to the application rootURL
    //   (should not be possible to use the ember app as just an external redirect service)
    const {
        oauthUrl, scope, clientId, redirectUri,
    } = config.OSF;
    const params = {
        scope,
        client_id: clientId,
        redirect_uri: encodeURIComponent(redirectUri),
        response_type: 'token',
    };
    if (nextUri) {
        params.state = encodeURIComponent(nextUri);
    }
    return `${oauthUrl}?${$.param(params)}`;
}

/**
 * Retrieve the correct URL for cookie-based in the OSF, including any additional configurable parameters
 * @private
 * @method getCookieAuthUrl
 * @param {string} nextUri Where to send the browser after a successful login request
 * @return {string}
 */
function getCookieAuthUrl(nextUri_) {
    const nextUri = nextUri_ || config.OSF.redirectUri;
    const loginUri = `${config.OSF.url}login/?next=${encodeURIComponent(nextUri)}`;
    return `${config.OSF.cookieLoginUrl}?service=${encodeURIComponent(loginUri)}`;
}

/**
 * Return the appropriate auth URL for the specified authorization mechanism (as specified in application configuration)
 * Currently supports `token` and `cookie` based authorization
 * @public
 * @method getAuthUrl
 * @return {string}
 */
function getAuthUrl() {
    const authType = config.authorizationType;
    if (authType === 'token') {
        return getOAuthUrl(...arguments);
    } else if (authType === 'cookie') {
        return getCookieAuthUrl(...arguments);
    } else {
        throw new EmberError(`Unrecognized authorization type: ${authType}`);
    }
}

function getTokenFromHash(hash_) {
    const hash = hash_.substring(1).split('&');
    for (const chunk of hash) {
        const [key, value] = chunk.split('=');
        if (key === 'access_token') {
            return value;
        }
    }
    return null;
}

export { getAuthUrl, getTokenFromHash };
