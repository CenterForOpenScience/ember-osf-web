import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class InternalUserSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'internal-user': InternalUserSerializer;
    } // eslint-disable-line semi
}
