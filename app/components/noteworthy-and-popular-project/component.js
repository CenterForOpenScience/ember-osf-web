import { computed } from '@ember/object';
import Component from '@ember/component';
import contributorList from '../../utils/contributor-list';

export default Component.extend({
    didInsertElement() {
        this._super(...arguments);
        this.$('.prevent-overflow').tooltip();
    },
    contributors: computed('project', function() {
        return contributorList(this.get('project'));
    }),
    compactDescription: computed('project.description', function() {
        const desc = this.get('project.description');
        if (!desc) {
            return '';
        }
        return desc.length > 115 ? `${desc.slice(0, 111)}...` : desc;
    }),
});
