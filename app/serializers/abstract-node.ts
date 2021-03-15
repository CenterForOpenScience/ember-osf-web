import OsfSerializer from './osf-serializer';

export default class AbstractNodeSerializer extends OsfSerializer {

}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'abstract-node': AbstractNodeSerializer;
    } // eslint-disable-line semi
}
