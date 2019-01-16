import OsfSerializer from './osf-serializer';

export default class DraftRegistrationSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'draft-registration': DraftRegistrationSerializer;
    } // eslint-disable-line semi
}
