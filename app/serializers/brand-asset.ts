import OsfSerializer from './osf-serializer';

export default class BrandAssetSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'brand-asset': BrandAssetSerializer;
    } // eslint-disable-line semi
}
