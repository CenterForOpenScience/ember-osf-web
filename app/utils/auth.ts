import config from 'ember-get-config';
import $ from 'jquery';

const {
    OSF,
    authorizationType,
} = config;

/**
 * Retrieve the correct URL for OAuth 2.0 authentication in the OSF, including any additional configurable parameters
 */
function getOAuthUrl(nextUri?: string): string {
    // OAuth requires that redirect URI match what was registered, exactly. We may need a parameter to signify next
    //   transition, if the user wants to return to ember at the point where they left off before needing to log in.
    // For now, we will put this in the `state` parameter (always returned unchanged) and implement that functionality
    // in ember later.
    // To avoid abuse, the application should forcibly truncate state, eg make it relative to the application rootURL
    //   (should not be possible to use the ember app as just an external redirect service)

    const params = {
        response_type: 'token',
        scope: OSF.scope,
        client_id: OSF.clientId,
        redirect_uri: OSF.redirectUri,
        state: nextUri,
    };

    return `${OSF.oauthUrl}?${$.param(params)}`;
}

/**
 * Retrieve the correct URL for cookie-based in the OSF, including any additional configurable parameters
 * @private
 * @method getCookieAuthUrl
 * @param {string} nextUri Where to send the browser after a successful login request
 * @return {string}
 */
function getCookieAuthUrl(nextUri = OSF.redirectUri) {
    const loginUri = `${OSF.url}login/?next=${encodeURIComponent(nextUri)}`;

    return `${OSF.cookieLoginUrl}?service=${encodeURIComponent(loginUri)}`;
}

/**
 * Return the appropriate auth URL for the specified authorization mechanism (as specified in application configuration)
 * Currently supports `token` and `cookie` based authorization
 */
export function getAuthUrl(nextUri?: string): string {
    switch (authorizationType) {
    case 'cookie':
        return getCookieAuthUrl(nextUri);
    case 'token':
        return getOAuthUrl(nextUri);
    default:
        throw new Error(`Unrecognized authorization type: ${authorizationType}`);
    }
}

export function getTokenFromHash(hash): string | null {
    const splitHash = hash.substring(1).split('&');

    for (const chunk of splitHash) {
        const [key, value] = chunk.split('=');

        if (key === 'access_token') {
            return value;
        }
    }

    return null;
}
