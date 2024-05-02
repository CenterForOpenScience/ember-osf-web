import OsfSerializer from './osf-serializer';

export default class ResourceReferenceSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'resource-reference': ResourceReferenceSerializer;
    } // eslint-disable-line semi
}
