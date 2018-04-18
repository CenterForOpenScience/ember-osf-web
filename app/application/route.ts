import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import OsfAuthenticatedRouteMixin from 'ember-osf-web/mixins/osf-authenticated-route';

export default class Application extends Route.extend(OsfAuthenticatedRouteMixin) {
    @service i18n;
    @service store;

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

        if (locale) {
            i18n.setProperties({ locale });
        }
    }
}
