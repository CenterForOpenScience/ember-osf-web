import OsfAdapter from './osf-adapter';

export default class IdentifierAdapter extends OsfAdapter {
    parentRelationship = 'referent';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        identifier: IdentifierAdapter;
    } // eslint-disable-line semi
}
