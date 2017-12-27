import Ember from 'ember';
import moment from 'moment';
import Component from '@ember/component';

export default Component.extend({
    date: Ember.computed('node.dateModified', function() {
        return moment(this.get('node.dateModified')).utc().format('YYYY-MM-DD h:mm A');
    }),
    contributors: Ember.computed('node.contributors', function() {
        // Trust contributors are cached due to emdedding done on dashboard
        const contribs = this.get('node.contributors.content.canonicalState');
        const len = contribs.length;
        const namePath = index => `node._internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.family_name`;
        // TODO generalize
        if (len === 1) {
            return this.get(namePath(0));
        } else if (len === 2) {
            return `${this.get(namePath(0))} and ${this.get(namePath(1))}`;
        } else if (len === 3) {
            return `${this.get(namePath(0))}, ${this.get(namePath(1))} and ${this.get(namePath(2))}`;
        } else {
            return `${this.get(namePath(0))}, ${this.get(namePath(1))}, ${this.get(namePath(2))} +${len}`;
        }
    }),
});
