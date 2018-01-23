import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
    tagName: 'span',
    i18n: service(),

    contributorList: computed('node.contributors', function() {
        const node = this.get('node');
        const contribs = node.get('contributors.content.canonicalState');
        if (!contribs) {
            return;
        }
        const len = contribs.length;
        const namePath = index => node.get(`_internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.family_name`) || node.get(`_internalModel.__relationships.initializedRelationships.contributors.canonicalState.${index}.__data.links.relationships.users.data.attributes.given_name`);
        switch (len) {
        case 1: return namePath(0);
        case 2: return `${namePath(0)} ${this.get('i18n').t('general.and')} ${namePath(1)}`;
        case 3: return `${namePath(0)}, ${namePath(1)} ${this.get('i18n').t('general.and')} ${namePath(2)}`;
        default: return `${namePath(0)}, ${namePath(1)}, ${namePath(2)} ${this.get('i18n').t('general.and')} ${len - 3} ${this.get('i18n').t('general.more')}`;
        }
    }),
});
