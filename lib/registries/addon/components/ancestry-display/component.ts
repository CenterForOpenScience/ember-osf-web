import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { allSettled, task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class AncestryDisplay extends Component.extend({
    getAncestors: task(function *(this: AncestryDisplay) {
        if (!this.node) {
            return [];
        }

        const parentId = this.node.belongsTo('parent').id();
        const rootId = this.node.belongsTo('root').id();

        // No ancestors
        if (this.node.id === rootId) {
            return [];
        }

        // One ancestor
        if (parentId === rootId && rootId !== null) {
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
                ancestors.insertAt(1, { id: '', title: this.i18n.t('general.ellipsis') });
            }
        }
        return ancestors;
    }).restartable(),
}) {
    @service i18n!: I18N;

    // Required arguments
    node?: Node;

    // Optional arguments
    delimiter?: string = defaultTo(this.delimiter, '/');

    @alias('getAncestors.lastComplete.value') ancestry!: string[];

    didReceiveAttrs(this: AncestryDisplay) {
        this.getAncestors.perform();
    }
}
