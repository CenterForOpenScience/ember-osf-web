import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    didInsertElement() {
        this._super(...arguments);
        this.$('.prevent-overflow').tooltip();
    },
    compactDescription: computed('project.description', function() {
        const desc = this.get('project.description');
        if (!desc) {
            return '';
        }
        return desc.length > 115 ? `${desc.slice(0, 111)}...` : desc;
    }),
});
