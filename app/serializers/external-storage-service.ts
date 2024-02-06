import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ExternalStorageServiceSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-storage-service': ExternalStorageServiceSerializer;
    } // eslint-disable-line semi
}
