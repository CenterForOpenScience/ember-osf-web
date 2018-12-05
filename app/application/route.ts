import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Route from '@ember/routing/route';
import config from 'ember-get-config';

import checkAuth from 'ember-osf-web/decorators/check-auth';

const {
    intl: {
        enabledLocales,
    },
} = config;

@checkAuth
export default class ApplicationRoute extends Route.extend(
    /*
     * If this doesn't use `.extend()`, then `ApplicationRoute.reopen(...)`
     * will open the `Route` prototype and affect all routes.
     *
     * Prevent `session.restore()` from being called several times on every
     * transition by this injected `beforeModel`:
     * https://github.com/simplabs/ember-simple-auth/blob/1.6.0/addon/initializers/setup-session-restoration.js#L8
     */
) {
    @service intl!: Intl;

    afterModel(this: ApplicationRoute) {
        const intl = this.get('intl');
        const availableLocales: [string] = intl.get('locales').toArray();
        let locale: string | undefined;

        // Works in Chrome and Firefox (editable in settings)
        if (navigator.languages && navigator.languages.length) {
            for (const lang of navigator.languages) {
                if (availableLocales.includes(lang)) {
                    locale = lang;
                    break;
                }
            }
            // Backup for Safari (uses system settings)
        } else if (navigator.language && availableLocales.includes(navigator.language)) {
            locale = navigator.language;
        }

        if (locale && enabledLocales.includes(locale)) {
            intl.setProperties({ locale });
        }
    }
}
