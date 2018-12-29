import OsfSerializer from './osf-serializer';

export default class PreprintProviderSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'preprint-provider': PreprintProviderSerializer;
    } // eslint-disable-line semi
}
