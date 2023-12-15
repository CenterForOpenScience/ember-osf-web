import OsfSerializer from './osf-serializer';

export default class CedarMetadataTemplateSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'cedar-metadata-template': CedarMetadataTemplateSerializer;
    } // eslint-disable-line semi
}
