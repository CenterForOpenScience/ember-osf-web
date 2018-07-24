import OsfSerializer from './osf-serializer';

export default class ScopeSerializer extends OsfSerializer {
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'scope': ScopeSerializer;
    }
}
