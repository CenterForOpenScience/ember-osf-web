import config from 'ember-osf-web/config/environment';
import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

const {
    OSF: {
        cookieDomain,
        cookies: {
            authSession: cookieName,
        },
        localStorageKeys: {
            authSession: localStorageKey,
        },
    },
} = config;

export default AdaptiveStore.extend({
    cookieDomain,
    cookieName,
    localStorageKey,
});
