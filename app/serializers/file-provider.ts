import OsfSerializer from './osf-serializer';

export default class FileProvider extends OsfSerializer {
    modelNameFromPayloadKey = function(): string {
        return 'file-provider';
    };
}
// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data' {
    interface SerializerRegistry {
        'file-provider': FileProvider;
    }
}
