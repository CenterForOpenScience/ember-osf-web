import AddonServiceAdapter from './addon-service';

export default class InternalResourceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'internal-resource': InternalResourceAdapter;
    } // eslint-disable-line semi
}
