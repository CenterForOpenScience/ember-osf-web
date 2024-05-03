import OsfSerializer from './osf-serializer';

export default class ExternalCitationServiceSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-citation-service': ExternalCitationServiceSerializer;
    } // eslint-disable-line semi
}
