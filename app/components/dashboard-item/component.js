import { computed } from '@ember/object';
import moment from 'moment';
import Component from '@ember/component';

export default Component.extend({
    ancestry: computed('node', 'node.{parent,root}', function() {
        const rootId = this.get('node._internalModel.__data.links.relationships.root.errors.length') ? undefined : this.get('node.root.id');
        const parentId = this.get('node._internalModel.__data.links.relationships.parent.errors.length') ? undefined : this.get('node.parent.id');
        const grandpaLink = this.get('node.parent.content._internalModel._data.links.relationships.parent.links.related.href');
        const grandpaId = grandpaLink ? grandpaLink.split('nodes')[1].split('/').filter(e => e)[0] : undefined;
        if (!rootId) {
            if (parentId) {
                this.set('_ancestry', this.get('node.parent.title'));
            }
            return '--private';
        }
        if (!parentId) {
            return '';
        }
        if (parentId === rootId) {
            return `${this.get('node.root.title')} / `;
        }
        if (grandpaId === rootId) {
            return `${this.get('node.root.title')} / ${this.get('node.parent.title')} / `;
        }
        return `${this.get('node.root.title')} / ... / ${this.get('node.parent.title')} / `;
    }),
    date: computed('node.dateModified', function() {
        return moment(this.get('node.dateModified')).utc().format('YYYY-MM-DD h:mm A');
    }),
    contributors: computed('node.contributors', function() {
        // Trust contributors are cached due to emdedding done on dashboard
        const contribs = this.get('node.contributors.content.canonicalState');
        if (!contribs) {
            return;
        }
        const len = contribs.length;
        const namePath = index => this.get(`node._internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.family_name`) || this.get(`node._internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.given_name`);
        switch (len) {
        case 1: return namePath(0);
        case 2: return `${namePath(0)} and ${namePath(1)}`;
        case 3: return `${namePath(0)}, ${namePath(1)} and ${namePath(2)}`;
        default: return `${namePath(0)}, ${namePath(1)}, ${namePath(2)} +${len - 3}`;
        }
    }),
});
