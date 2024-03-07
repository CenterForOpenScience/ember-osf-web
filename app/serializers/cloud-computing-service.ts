import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';

export default class CloudComputingServiceSerializer extends JSONAPISerializer {
    keyForAttribute(key: string) {
        return underscore(key);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'cloud-computing-service': CloudComputingServiceSerializer;
    } // eslint-disable-line semi
}
