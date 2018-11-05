import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';

import { ButtonStyle } from '../delete-button/component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class DeleteNodeButton extends Component.extend({
    _loadDescendentsTask: task(function *(this: DeleteNodeButton) {
        if (!this.node) {
            return undefined;
        }
        const results: QueryHasManyResult<Node> = yield this.store.query('node', {
            'page[size]': 100,
            filter: {
                child_of: this.node.id,
            },
        });
        this.set('hasTooManyChildren', results.meta.total > results.meta.per_page);
        return results;
    }).drop(),
}) {
    // Required arguments
    node!: Node;

    // Optional arguments
    buttonStyle?: ButtonStyle;
    onDelete?: () => void;

    // Private properties
    @service store!: DS.Store;

    hasTooManyChildren = false;

    @action
    async _deleteNode() {
        if (!this.node) {
            return;
        }
        try {
            await this.node.destroyRecord();
            // TODO toast
            if (this.onDelete) {
                this.onDelete();
            }
        } catch (e) {
            // TODO toast
            throw e;
        }
    }
}
