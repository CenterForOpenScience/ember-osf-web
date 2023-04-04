import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class MetadataRecordSearchSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-record-search': MetadataRecordSearchSerializer;
    } // eslint-disable-line semi
}
