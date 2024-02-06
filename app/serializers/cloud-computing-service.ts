import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class CloudComputingServiceSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'cloud-computing-service': CloudComputingServiceSerializer;
    } // eslint-disable-line semi
}
