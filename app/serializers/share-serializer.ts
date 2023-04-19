import JSONAPISerializer from '@ember-data/serializer/json-api';
import { camelize } from '@ember/string';

export default class ShareSerializer extends JSONAPISerializer {
    keyForAttribute(key: string) {
        return camelize(key);
    }

    keyForRelationship(key: string) {
        return camelize(key);
    }
}
