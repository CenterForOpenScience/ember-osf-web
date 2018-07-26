import { underscore } from '@ember/string';
import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
    keyForAttribute(attr) {
        return underscore(attr);
    },
    keyForRelationship(relationship) {
        return underscore(relationship);
    },
});
