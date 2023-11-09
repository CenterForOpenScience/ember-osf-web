import OsfSerializer from './osf-serializer';

export default class AddonExternalAccountSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'addon-external-account': AddonExternalAccountSerializer;
    } // eslint-disable-line semi
}
