import OsfSerializer from './osf-serializer';

export default class Node extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'node': Node;
    }
}
