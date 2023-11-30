import OsfSerializer from './osf-serializer';

export default class PreprintRequestSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'preprint-request': PreprintRequestSerializer;
    } // eslint-disable-line semi
}
