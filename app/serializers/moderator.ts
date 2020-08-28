import OsfSerializer from './osf-serializer';

export default class ModeratorSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'moderator': ModeratorSerializer;
    } // eslint-disable-line semi
}
