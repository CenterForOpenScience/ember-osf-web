import OsfSerializer from './osf-serializer';

export default class MetadataValueSearchSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-value-search': MetadataValueSearchSerializer;
    } // eslint-disable-line semi
}
