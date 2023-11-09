import AddonServiceAdapter from './addon-service';

export default class StorageAddonProviderAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'storage-addon-provider': StorageAddonProviderAdapter;
    } // eslint-disable-line semi
}
