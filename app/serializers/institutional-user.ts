import OsfSerializer from './osf-serializer';

export default class InstitutionalUserSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'institutional-user': InstitutionalUserSerializer;
    } // eslint-disable-line semi
}
