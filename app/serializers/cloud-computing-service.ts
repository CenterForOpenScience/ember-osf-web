import AddonServiceSerializer from './addon-service-serializer';

export default class CloudComputingServiceSerializer extends AddonServiceSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'cloud-computing-service': CloudComputingServiceSerializer;
    } // eslint-disable-line semi
}
