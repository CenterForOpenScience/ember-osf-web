import AddonServiceAdapter from './addon-service';

export default class CloudComputingServiceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'cloud-computing-service': CloudComputingServiceAdapter;
    } // eslint-disable-line semi
}
