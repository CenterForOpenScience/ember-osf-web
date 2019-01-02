import OsfSerializer from './osf-serializer';

export default class LicenseSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        license: LicenseSerializer;
    } // eslint-disable-line semi
}
