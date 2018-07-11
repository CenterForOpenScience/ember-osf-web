import Features from 'ember-feature-flags';

declare module 'ember-feature-flags/services/features' {
    export = Features;
}

declare module '@ember/service' {
    interface Registry {
        'features': Features;
    }
}
