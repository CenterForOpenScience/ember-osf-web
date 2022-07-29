import OsfSerializer from './osf-serializer';

export default class ResourceSerializer extends OsfSerializer {

}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'resource': ResourceSerializer;
    } // eslint-disable-line semi
}
