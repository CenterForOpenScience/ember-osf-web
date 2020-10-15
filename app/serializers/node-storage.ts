import OsfSerializer from './osf-serializer';

export default class NodeStorageSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'node-storage': NodeStorageSerializer;
    } // eslint-disable-line semi
}
