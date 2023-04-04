import OsfSerializer from './osf-serializer';

export default class MetadataRecordSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-record': MetadataRecordSerializer;
    } // eslint-disable-line semi
}
