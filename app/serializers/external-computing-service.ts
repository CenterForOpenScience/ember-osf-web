import OsfSerializer from './osf-serializer';

export default class ExternalComputingServiceSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-computing-service': ExternalComputingServiceSerializer;
    } // eslint-disable-line semi
}
