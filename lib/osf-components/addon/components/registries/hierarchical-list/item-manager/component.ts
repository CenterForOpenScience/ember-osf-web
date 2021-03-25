import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import NodeModel from 'ember-osf-web/models/node';
import { HierarchicalListManager } from 'osf-components/components/registries/hierarchical-list';

import template from './template';

export interface HierarchicalListItemManager {
    listManager: HierarchicalListManager;
    item: NodeModel;
    shouldShowChildren: boolean;
    isRoot: boolean;
    toggleShowChildren: () => void;
    onChange: (event: Event) => void;
}

@layout(template)
@tagName('')
export default class HierarchicalListItemManagerComponent extends Component {
    listManager!: HierarchicalListManager;
    item!: NodeModel;
    shouldShowChildren: boolean = true;
    isRoot: boolean = false;

    @computed('listManager.selectedNodes.[]')
    get itemChecked() {
        return this.listManager.isChecked(this.item);
    }

    @computed('item')
    get children() {
        return this.item.hasMany('children').value();
    }

    @action
    toggleShowChildren() {
        this.toggleProperty('shouldShowChildren');
    }

    @action
    onChange(event: Event) {
        if (event) {
            this.listManager.onChange(event, this.item);
            if (!this.shouldShowChildren) {
                this.toggleProperty('shouldShowChildren');
            }
        }
    }
}
