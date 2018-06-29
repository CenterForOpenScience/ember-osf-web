declare module 'ember-i18n/services/i18n' {
    import { A } from '@ember/array';
    import Computed from '@ember/object/computed';
    import Service from '@ember/service';

    export default class I18N extends Service {
        locales: Computed<A>;
        locale: string;
        t(key: string, values?: any): string;
    }
}
