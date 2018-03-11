import OsfSerializer from './osf-serializer';

export default class Metaschema extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'metaschema': Metaschema;
    }
}
