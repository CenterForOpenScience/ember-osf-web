import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { allSettled, task } from 'ember-concurrency';
import I18n from 'ember-i18n/services/i18n';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import Node from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

@localClassNames('NodeAncestry')
export default class NodeAncestry extends Component.extend({
    getAncestorTitles: task(function *(this: NodeAncestry) {
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
            return [parentNode.title];
        }

        // At least two ancestors
        const results = yield allSettled([
            this.node.root,
            this.node.parent,
        ]);

        const titles = results.mapBy('value').compact().mapBy('title');

        // Results might have undefined `value` if ancestors are private
        if (titles.length > 1) {
            const parent = results[1].value;
            if (parent && parent.belongsTo('parent').id() !== rootId) {
                titles.insertAt(1, this.i18n.t('general.ellipsis'));
            }
        }
        return titles;
    }).restartable(),
}) {
    // Required arguments
    node!: Node;

    // Optional argument
    delimiter: string = defaultTo(this.delimiter, '/');

    // Private properties
    @service i18n!: I18n;
    layout = layout;
    styles = styles;

    @alias('getAncestorTitles.lastComplete.value') ancestry!: string[];

    didReceiveAttrs() {
        this.getAncestorTitles.perform();
    }
}
