import OsfAdapter from './osf-adapter';

export default class RevisionAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'revision': RevisionAdapter;
    } // eslint-disable-line semi
}
