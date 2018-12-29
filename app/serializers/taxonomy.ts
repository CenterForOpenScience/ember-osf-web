import OsfSerializer from './osf-serializer';

export default class TaxonomySerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        taxonomy: TaxonomySerializer;
    } // eslint-disable-line semi
}
