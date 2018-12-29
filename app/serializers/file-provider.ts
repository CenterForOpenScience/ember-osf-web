import OsfSerializer from './osf-serializer';

export default class FileProviderSerializer extends OsfSerializer {
    modelNameFromPayloadKey() {
        return 'file-provider';
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'file-provider': FileProviderSerializer;
    } // eslint-disable-line semi
}
