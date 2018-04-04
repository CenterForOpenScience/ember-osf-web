import Route from '@ember/routing/route';
import OSFAgnosticAuthRouteMixin from 'ember-osf-web/mixins/osf-agnostic-auth-route';

export default class Application extends Route.extend(OSFAgnosticAuthRouteMixin) {
    afterModel(this: Application) {
        const availableLocales: [string] = this.get('i18n.locales').toArray();
        let locale: string | null = null;

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
            this.set('i18n.locale', locale);
        }
    }
}
