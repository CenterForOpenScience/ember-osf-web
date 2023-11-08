import OsfSerializer from './osf-serializer';

export default class NodeAddonSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'node-addon': NodeAddonSerializer;
    } // eslint-disable-line semi
}
