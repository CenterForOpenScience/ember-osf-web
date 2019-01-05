import OsfSerializer from './osf-serializer';

export default class CitationSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        citation: CitationSerializer;
    } // eslint-disable-line semi
}
