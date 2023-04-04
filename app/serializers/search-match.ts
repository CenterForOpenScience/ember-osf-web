import OsfSerializer from './osf-serializer';

export default class SearchMatchSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'search-match': SearchMatchSerializer;
    } // eslint-disable-line semi
}
