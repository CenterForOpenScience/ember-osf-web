import OsfSerializer from './osf-serializer';

export default class MetadataPropertySearchSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-property-search': MetadataPropertySearchSerializer;
    } // eslint-disable-line semi
}
