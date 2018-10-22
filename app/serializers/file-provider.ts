import { ModelRegistry } from 'ember-data';
import OsfSerializer from './osf-serializer';

export default class FileProvider extends OsfSerializer {
    modelNameFromPayloadKey(): keyof ModelRegistry {
        return 'file-provider';
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'file-provider': FileProvider;
    } // eslint-disable-line semi
}
