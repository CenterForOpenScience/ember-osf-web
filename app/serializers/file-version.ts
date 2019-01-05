import OsfSerializer from './osf-serializer';

export default class FileVersionSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'file-version': FileVersionSerializer;
    } // eslint-disable-line semi
}
