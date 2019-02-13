import OsfSerializer from './osf-serializer';

export default class AccountSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        account: AccountSerializer;
    } // eslint-disable-line semi
}
