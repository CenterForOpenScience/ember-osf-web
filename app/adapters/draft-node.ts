import OsfAdapter from './osf-adapter';

export default class DraftNodeAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'draft-node': DraftNodeAdapter;
    } // eslint-disable-line semi
}
