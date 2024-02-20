import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';

export default class ExternalStorageServiceSerializer extends JSONAPISerializer {
    keyForAttribute(key: string) {
        return underscore(key);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-storage-service': ExternalStorageServiceSerializer;
    } // eslint-disable-line semi
}
