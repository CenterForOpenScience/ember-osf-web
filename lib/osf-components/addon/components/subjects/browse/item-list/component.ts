import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class ItemList extends Component {
    // required
    ItemManager!: unknown; // contextual component

    // optional
    items?: unknown[];

    expectedNumItems?: number;

    @computed('items.length', 'expectedNumItems')
    get itemCount(): number {
        const { items, expectedNumItems } = this;
        return items ? items.length : expectedNumItems || 0;
    }

    init() {
        super.init();

        assert('@ItemManager is required', Boolean(this.ItemManager));
    }
}
