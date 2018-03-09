import OsfSerializer from './osf-serializer';

export default class FileProvider extends OsfSerializer {
    modelNameFromPayloadKey(): string {
        return 'file-provider';
    }
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'file-provider': FileProvider;
    }
}
