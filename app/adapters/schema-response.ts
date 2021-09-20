import OsfAdapter from './osf-adapter';

export default class SchemaResponseAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'schema-response': SchemaResponseAdapter;
    } // eslint-disable-line semi
}
