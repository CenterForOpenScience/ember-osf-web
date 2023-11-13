import AddonServiceAdapter from './addon-service';

export default class ConfiguredStorageAddonAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'configured-storage-addon': ConfiguredStorageAddonAdapter;
    } // eslint-disable-line semi
}
