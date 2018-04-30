declare module 'ember-metrics/services/metrics' {
    import Service from '@ember/service';

    export default class Metrics extends Service {
        trackEvent(params: object): void;
        trackPage(params: object): void;
    }
}
