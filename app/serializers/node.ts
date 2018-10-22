import OsfSerializer from './osf-serializer';

export default class Node extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        node: Node;
    } // eslint-disable-line semi
}
