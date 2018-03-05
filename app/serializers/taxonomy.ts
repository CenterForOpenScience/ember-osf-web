import OsfSerializer from './osf-serializer';

export default class Taxonomy extends OsfSerializer {}


declare module 'ember-data' {
    interface SerializerRegistry {
        'taxonomy': Taxonomy;
    }
}
