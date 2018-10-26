import { ModelRegistry } from 'ember-data';
import OsfSerializer from './osf-serializer';

export default class FileProvider extends OsfSerializer {
    modelNameFromPayloadKey(): keyof ModelRegistry {
        return 'file-provider';
    }
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'file-provider': FileProvider;
    }
}
