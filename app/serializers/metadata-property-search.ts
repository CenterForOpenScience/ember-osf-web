import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class MetadataPropertySearchSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-property-search': MetadataPropertySearchSerializer;
    } // eslint-disable-line semi
}
