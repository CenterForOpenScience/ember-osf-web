import OsfSerializer from './osf-serializer';

export default class NodeSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        node: NodeSerializer;
    } // eslint-disable-line semi
}
