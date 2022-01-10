import OsfAdapter from './osf-adapter';

export default class SchemaResponseActionAdapter extends OsfAdapter {
    parentRelationship = 'target';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'schema-response-action': SchemaResponseActionAdapter;
    } // eslint-disable-line semi
}
