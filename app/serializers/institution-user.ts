import OsfSerializer from './osf-serializer';

export default class InstitutionUserSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'institution-user': InstitutionUserSerializer;
    } // eslint-disable-line semi
}
