import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class DashboardItem extends Component {
    i18n = service('i18n');

    private = not('node.root.id');

    ancestry = computed('node', 'node.{parent,root}', function(): string {
        const rootId = this.get('node.root.id');
        const rootLink = this.get('node.root.links.self');
        const parentId = this.get('node.parent.id');
        const grandpaLink = this.get('node.parent.links.relationships.parent.links.related.href');

        if (!rootId || !parentId) {
            return parentId ? this.get('node.parent.title') : '';
        }

        const items = [this.get('node.root.title')];
        const separator = ' / ';

        if (grandpaLink === rootLink) {
            items.push(this.get('node.parent.title'));
        } else if (parentId !== rootId) {
            items.push(this.get('i18n').t('general.ellipses'), this.get('node.parent.title'));
        }

        return [...items, ''].join(separator);
    });

    contributors = alias('node.contributors');

    date = computed('node.dateModified', function(): string {
        return moment(this.get('node.dateModified')).utc().format('YYYY-MM-DD h:mm A');
    });
}
