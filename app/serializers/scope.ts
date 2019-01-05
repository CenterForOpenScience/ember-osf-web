import OsfSerializer from './osf-serializer';

export default class ScopeSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        scope: ScopeSerializer;
    } // eslint-disable-line semi
}
