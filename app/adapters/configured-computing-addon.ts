import AddonServiceAdapter from './addon-service';

export default class ConfiguredComputingAddonAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'configured-computing-addon': ConfiguredComputingAddonAdapter;
    } // eslint-disable-line semi
}
