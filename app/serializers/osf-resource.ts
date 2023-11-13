import OsfSerializer from './osf-serializer';

export default class OsfResourceSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'osf-resource': OsfResourceSerializer;
    } // eslint-disable-line semi
}
