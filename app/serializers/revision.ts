import OsfSerializer from './osf-serializer';

export default class RevisionSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'revision': RevisionSerializer;
    } // eslint-disable-line semi
}
