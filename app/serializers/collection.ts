import OsfSerializer from './osf-serializer';

export default class Collection extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'collection': Collection;
    }
}
