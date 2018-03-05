import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import OSFAgnosticAuthRouteMixin from 'ember-osf-web/mixins/osf-agnostic-auth-route';

export default class Application extends Route.extend(OSFAgnosticAuthRouteMixin, {
    beforeModel(...args) {
        this.get('moment').setTimeZone('UTC');

        return this._super(...args);
    },

    actions: {
        didTransition() {
            Object.assign(window, { prerenderReady: true });
            return true; // Bubble the didTransition event
        },
    },
}) {
    moment = service('moment');

    afterModel() {
        const availableLocales: [string] = this.get('i18n.locales').toArray();
        let locale: string;

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
