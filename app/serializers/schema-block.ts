import OsfSerializer from './osf-serializer';

export default class SchemaBlockSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'schema-block': SchemaBlockSerializer;
    } // eslint-disable-line semi
}
