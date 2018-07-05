import OsfSerializer from './osf-serializer';

export default class RegionSerializer extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'region': RegionSerializer;
    }
}
