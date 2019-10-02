import OsfSerializer from './osf-serializer';

export default class SubjectSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        subject: SubjectSerializer;
    } // eslint-disable-line semi
}
