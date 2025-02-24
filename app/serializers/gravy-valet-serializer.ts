import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';

export default class GravyValetSerializer extends JSONAPISerializer {
    keyForAttribute(key: string) {
        return underscore(key);
    }

    keyForRelationship(key: string) {
        return underscore(key);
    }
}
