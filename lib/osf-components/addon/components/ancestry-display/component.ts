import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { allSettled, task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';

import { layout } from 'ember-osf-web/decorators/component';
import NodeModel from 'ember-osf-web/models/node';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class AncestryDisplay extends Component {
    @service intl!: Intl;

    // Required arguments
    node!: NodeModel;

    // Optional arguments
    delimiter: string = '/';
    useLinks: boolean = false;

    @alias('getAncestors.lastComplete.value') ancestry?: string[];

    @task({ withTestWaiter: true, restartable: true, on: 'didReceiveAttrs' })
    getAncestors = task(function *(this: AncestryDisplay) {
        if (!this.node || this.node.isRoot) {
            return [];
        }

        const parentId = this.node.belongsTo('parent').id();
        const rootId = this.node.belongsTo('root').id();

        // One ancestor
        if (parentId === rootId) {
            const parentNode = yield this.node.parent;
            const { id, title }: {id: string, title: string } = parentNode;
            return [{ id, title }];
        }

        // At least two ancestors
        const results = yield allSettled([
            this.node.root,
            this.node.parent,
        ]);

        const ancestors = results
            .mapBy('value')
            .compact()
            .map(({ id, title }: { id: string, title: string }) => ({ id, title }));

        // Results might have undefined `value` if ancestors are private
        if (ancestors.length > 1) {
            const parent = results[1].value;
            if (parent && parent.belongsTo('parent').id() !== rootId) {
                ancestors.insertAt(1, { id: '', title: this.intl.t('general.ellipsis') });
            }
        }
        return ancestors;
    });
}
