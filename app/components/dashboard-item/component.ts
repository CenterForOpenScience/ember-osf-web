import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { get } from '@ember/object';
import { allSettled, task } from 'ember-concurrency';
import moment from 'moment';

import Node from 'ember-osf-web/models/node';

export default class DashboardItem extends Component {
    @service i18n;
    @service analytics;

    node: Node;

    getAncestorTitles = task(function* (this: DashboardItem) {
        const node = this.get('node');
        const parentId = node.belongsTo('parent').id();
        const rootId = node.belongsTo('root').id();

        // No ancestors
        if (node.get('id') === rootId) {
            return [];
        }

        // One ancestor
        if (parentId === rootId) {
            const parentNode = yield node.get('parent');
            return [parentNode.get('title')];
        }

        // At least two ancestors
        const results = yield allSettled([
            node.get('root'),
            node.get('parent'),
        ]);

        const titles = results.mapBy('value').compact().mapBy('title');

        // Results might have undefined `value` if ancestors are private
        if (titles.length > 1) {
            const parent = results[1].value;
            if (parent && parent.belongsTo('parent').id() !== rootId) {
                titles.insertAt(1, this.get('i18n').t('general.ellipsis'));
            }
        }
        return titles;
    }).restartable();

    @alias('getAncestorTitles.lastComplete.value') ancestry;
    @alias('node.contributors') contributors;

    @computed('node.dateModified')
    get date(this: DashboardItem): string {
        return moment(this.get('node.dateModified')).format('YYYY-MM-DD h:mm A');
    }

    constructor() {
        super();
        get(this, 'getAncestorTitles').perform();
    }
}
