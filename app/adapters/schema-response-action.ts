import ActionAdapter from './action';

export default class SchemaResponseActionAdapter extends ActionAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'schema-response-action': SchemaResponseActionAdapter;
    } // eslint-disable-line semi
}
