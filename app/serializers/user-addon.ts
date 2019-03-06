import OsfSerializer from './osf-serializer';

export default class UserAddonSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        addon: UserAddonSerializer;
    } // eslint-disable-line semi
}
