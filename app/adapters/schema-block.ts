import OsfAdapter from './osf-adapter';

export default class SchemaBlockAdapter extends OsfAdapter {
    parentRelationship = 'registrationSchema';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'schema-block': SchemaBlockAdapter;
    } // eslint-disable-line semi
}
