import OsfSerializer from './osf-serializer';

export default class FooBarSerializer extends OsfSerializer {
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'foo-bar': FooBarSerializer;
    }
}
