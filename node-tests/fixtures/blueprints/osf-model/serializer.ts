import OsfSerializer from './osf-serializer';

export default class FooBarSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'foo-bar': FooBarSerializer;
    } // eslint-disable-line semi
}
