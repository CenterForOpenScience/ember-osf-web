import OsfSerializer from './osf-serializer';

export default class CitationStyleSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'citation-style': CitationStyleSerializer;
    } // eslint-disable-line semi
}
