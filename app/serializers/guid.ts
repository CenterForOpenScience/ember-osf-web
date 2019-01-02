import OsfSerializer from './osf-serializer';

export default class GuidSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        guid: GuidSerializer;
    } // eslint-disable-line semi
}
