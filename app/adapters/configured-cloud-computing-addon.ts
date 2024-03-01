import AddonServiceAdapter from './addon-service';

export default class ConfiguredCloudComputingAddonAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'configured-cloud-computing-addon': ConfiguredCloudComputingAddonAdapter;
    } // eslint-disable-line semi
}
