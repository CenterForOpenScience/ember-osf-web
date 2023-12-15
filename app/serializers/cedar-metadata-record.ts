import OsfSerializer from './osf-serializer';

export default class CedarMetadataRecordSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'cedar-metadata-record': CedarMetadataRecordSerializer;
    } // eslint-disable-line semi
}
