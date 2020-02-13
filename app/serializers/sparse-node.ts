import OsfSerializer from './osf-serializer';

export default class SparseNodeSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'sparse-node': SparseNodeSerializer;
    } // eslint-disable-line semi
}
