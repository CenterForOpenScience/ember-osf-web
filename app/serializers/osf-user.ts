import OsfSerializer from './osf-serializer';

export default class OsfUserSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'osf-user': OsfUserSerializer;
    } // eslint-disable-line semi
}
