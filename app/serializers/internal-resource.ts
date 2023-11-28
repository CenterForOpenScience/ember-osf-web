import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class InternalResourceSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'internal-resource': InternalResourceSerializer;
    } // eslint-disable-line semi
}
