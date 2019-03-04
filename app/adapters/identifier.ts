import OsfAdapter from './osf-adapter';

export default class IdentifierAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        identifier: IdentifierAdapter;
    } // eslint-disable-line semi
}
