import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class MetadataRecordSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-record': MetadataRecordSerializer;
    } // eslint-disable-line semi
}
