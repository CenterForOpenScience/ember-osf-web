import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { ItemManager } from 'osf-components/components/subjects/browse/item-manager/component';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class ItemDisplay extends Component {
    // required
    itemManager!: ItemManager;

    // private
    shouldShowChildren: boolean = false;

    @action
    toggleChildren() {
        const {
            shouldShowChildren,
            itemManager,
        } = this;

        this.toggleProperty('shouldShowChildren');
        if (shouldShowChildren && !itemManager.children) {
            itemManager.loadChildren();
        }
    }
}
