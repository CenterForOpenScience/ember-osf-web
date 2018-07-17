declare module 'ember-metrics/services/metrics' {
    import Service from '@ember/service';

    export default class Metrics extends Service {
        trackEvent(params: object): void;

        /* eslint-disable no-dupe-class-members */
        trackPage(params: object): void;
        trackPage(adapterName: string, params: object): void;
        /* eslint-enable no-dupe-class-members */
    }
}
