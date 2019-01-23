import OsfSerializer from './osf-serializer';

export default class RegionSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        region: RegionSerializer;
    } // eslint-disable-line semi
}
