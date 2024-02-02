import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';

export default class AddonServiceSerializer extends JSONAPISerializer {
    keyForAttribute(key: string) {
        return underscore(key);
    }

    keyForRelationship(key: string) {
        return underscore(key);
    }
}
