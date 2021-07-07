import OsfSerializer from './osf-serializer';

export default class SchemaResponseSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'schema-response': SchemaResponseSerializer;
    } // eslint-disable-line semi
}
