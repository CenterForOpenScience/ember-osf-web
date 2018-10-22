import OsfSerializer from './osf-serializer';

export default class DraftRegistration extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'draft-registration': DraftRegistration;
    } // eslint-disable-line semi
}
