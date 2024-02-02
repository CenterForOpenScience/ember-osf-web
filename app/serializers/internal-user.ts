import AddonServiceSerializer from './addon-service-serializer';

export default class InternalUserSerializer extends AddonServiceSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'internal-user': InternalUserSerializer;
    } // eslint-disable-line semi
}
