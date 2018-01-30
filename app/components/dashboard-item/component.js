import { computed } from '@ember/object';
import moment from 'moment';
import Component from '@ember/component';

export default Component.extend({
    private: false,
    ancestry: computed('node', 'node.{parent,root}', function() {
        const rootId = this.get('node.root.id');
        const rootLink = this.get('node.root.links.self');
        const parentId = this.get('node.parent.id');
        const grandpaLink = this.get('node.parent.links.relationships.parent.links.related.href');
        if (!rootId) {
            this.set('private', true);
            if (parentId) {
                return parentId ? this.get('node.parent.title') : '';
            }
        }
        if (!parentId) {
            return '';
        }
        if (parentId === rootId) {
            return `${this.get('node.root.title')} / `;
        }
        if (grandpaLink === rootLink) {
            return `${this.get('node.root.title')} / ${this.get('node.parent.title')} / `;
        }
        return `${this.get('node.root.title')} / ... / ${this.get('node.parent.title')} / `;
    }),
    date: computed('node.dateModified', function() {
        return moment(this.get('node.dateModified')).utc().format('YYYY-MM-DD h:mm A');
    }),
});
