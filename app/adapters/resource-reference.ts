import AddonServiceAdapter from './addon-service';

export default class ResourceReferenceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'resource-reference': ResourceReferenceAdapter;
    } // eslint-disable-line semi
}
