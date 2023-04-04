import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class MetadataValueSearchSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-value-search': MetadataValueSearchSerializer;
    } // eslint-disable-line semi
}
