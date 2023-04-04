import OsfSerializer from './osf-serializer';

export default class MetadataRecordSearchSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-record-search': MetadataRecordSearchSerializer;
    } // eslint-disable-line semi
}
