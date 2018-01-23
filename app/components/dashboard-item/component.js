import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Component from '@ember/component';
import contributorList from '../../utils/contributor-list';

export default Component.extend({
    i18n: service(),
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
        return contributorList(this.get('node'), this.get('i18n').t('general.and'));
    }),
});
