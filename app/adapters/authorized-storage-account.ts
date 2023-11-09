import AddonServiceAdapter from './addon-service';

export default class AuthorizedStorageAccountAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'authorized-storage-account': AuthorizedStorageAccountAdapter;
    } // eslint-disable-line semi
}
