import OsfSerializer from './osf-serializer';

export default class DraftNodeSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'draft-node': DraftNodeSerializer;
    } // eslint-disable-line semi
}
