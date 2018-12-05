declare module '@ember-intl/services/intl' {
    import { A } from '@ember/array';
    import Computed from '@ember/object/computed';
    import Service from '@ember/service';

    export default class Intl extends Service {
        locales: Computed<A>;
        locale: string;
        t(key: string, values?: any): string;
    }
}
