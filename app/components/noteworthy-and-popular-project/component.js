import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    contributors: computed('project', function() {
        const contribs = this.get('project.contributors.content.canonicalState');
        if (!contribs) {
            return;
        }
        const len = contribs.length;
        const namePath = index => this.get(`project._internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.family_name`) || this.get(`project._internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.given_name`);
        switch (len) {
        case 1: return namePath(0);
        case 2: return `${namePath(0)}, ${namePath(1)}`;
        case 3: return `${namePath(0)}, ${namePath(1)}, ${namePath(2)}`;
        default: return `${namePath(0)}, ${namePath(1)}, ${namePath(2)} +${len - 3}`;
        }
    }),
    compactDescription: computed('project.description', function() {
        const desc = this.get('project.description');
        if (!desc) {
            return '';
        }
        return desc.length > 115 ? `${desc.slice(0, 111)}...` : desc;
    }),
});
