import Ember from 'ember';
import { JSONAPISerializer } from 'ember-cli-mirage';

const { underscore } = Ember.String;

export default JSONAPISerializer.extend({
    keyForAttribute(attr) {
        return underscore(attr);
    },
    keyForRelationship(relationship) {
        return underscore(relationship);
    },
});
