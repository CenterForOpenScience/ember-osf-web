import OsfSerializer from './osf-serializer';

export default class InternalUserSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'internal-user': InternalUserSerializer;
    } // eslint-disable-line semi
}
