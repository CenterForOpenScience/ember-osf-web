import AddonServiceAdapter from './addon-service';

export default class ExternalStorageServiceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'external-storage-service': ExternalStorageServiceAdapter;
    } // eslint-disable-line semi
}
