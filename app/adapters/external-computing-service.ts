import AddonServiceAdapter from './addon-service';

export default class ExternalComputingServiceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'external-computing-service': ExternalComputingServiceAdapter;
    } // eslint-disable-line semi
}
