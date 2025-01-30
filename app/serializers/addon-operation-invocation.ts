import GravyValetSerializer from './gravy-valet-serializer';

export default class AddonOperationInvocationSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'addon-operation-invocation': AddonOperationInvocationSerializer;
    } // eslint-disable-line semi
}
