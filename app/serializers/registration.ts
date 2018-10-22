import OsfSerializer from './osf-serializer';

export default class Registration extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        registration: Registration;
    } // eslint-disable-line semi
}
