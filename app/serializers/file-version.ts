import OsfSerializer from './osf-serializer';

export default class FileVersion extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'file-version': FileVersion;
    } // eslint-disable-line semi
}
