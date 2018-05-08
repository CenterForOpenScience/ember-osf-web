import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import DS from 'ember-data';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import OsfAuthenticatedRouteMixin from 'ember-osf-web/mixins/osf-authenticated-route';

const {
    i18n: {
        enabledLocales,
    },
} = config;

export default class Application extends Route.extend(OsfAuthenticatedRouteMixin) {
    @service i18n!: I18N;
    @service store!: DS.Store;

    afterModel(this: Application) {
        const i18n = this.get('i18n');
        const availableLocales: [string] = i18n.get('locales').toArray();
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
            i18n.setProperties({ locale });
        }
    }
}
