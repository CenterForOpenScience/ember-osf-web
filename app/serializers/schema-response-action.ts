import ActionSerializer from './action';

export default class SchemaResponseActionSerializer extends ActionSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'schema-response-action': SchemaResponseActionSerializer;
    } // eslint-disable-line semi
}
