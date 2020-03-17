import OsfSerializer from './osf-serializer';

export default class BrandSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        brand: BrandSerializer;
    } // eslint-disable-line semi
}
