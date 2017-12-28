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
        const namePath = index => this.get(`node._internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.family_name`);
        switch (len) {
        case 1: return namePath(0);
        case 2: return `${namePath(0)} and ${namePath(1)}`;
        case 3: return `${namePath(0)}, ${namePath(1)} and ${namePath(2)}`;
        default: return `${namePath(0)}, ${namePath(1)}, ${namePath(2)} +${len - 3}`;
        }
    }),
});
