import OsfSerializer from './osf-serializer';

export default class WikiSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        wiki: WikiSerializer;
    } // eslint-disable-line semi
}
