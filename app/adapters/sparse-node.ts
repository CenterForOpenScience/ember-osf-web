import OsfAdapter from './osf-adapter';

export default class SparseNodeAdapter extends OsfAdapter {
    pathForType(_: string) {
        return 'sparse/nodes';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'sparse-node': SparseNodeAdapter;
    } // eslint-disable-line semi
}
