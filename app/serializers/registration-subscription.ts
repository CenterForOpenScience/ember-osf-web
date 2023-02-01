import OsfSerializer from './osf-serializer';

export default class RegistrationSubscriptionSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'registration-subscription': RegistrationSubscriptionSerializer;
    } // eslint-disable-line semi
}
