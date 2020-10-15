import OsfAdapter from './osf-adapter';

export default class NodeStorageAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'node-storage': NodeStorageAdapter;
    } // eslint-disable-line semi
}
