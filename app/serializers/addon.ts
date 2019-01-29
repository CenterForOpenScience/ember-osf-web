import OsfSerializer from './osf-serializer';

export default class AddonSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        addon: AddonSerializer;
    } // eslint-disable-line semi
}
