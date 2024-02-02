import AddonServiceSerializer from './addon-service-serializer';

export default class CitationServiceSerializer extends AddonServiceSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'citation-service': CitationServiceSerializer;
    } // eslint-disable-line semi
}
