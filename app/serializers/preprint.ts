import OsfSerializer from './osf-serializer';

export default class PreprintSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        preprint: PreprintSerializer;
    } // eslint-disable-line semi
}
