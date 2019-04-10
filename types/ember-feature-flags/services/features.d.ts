import Features from 'ember-feature-flags';

interface MyFeatures extends Features {
    flags: string[];
}

declare module 'ember-feature-flags/services/features' {
    export = MyFeatures;
}

declare module '@ember/service' {
    interface Registry {
        'features': Features;
    }
}
