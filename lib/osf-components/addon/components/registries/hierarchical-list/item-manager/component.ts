import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import NodeModel from 'ember-osf-web/models/node';

import { HierarchicalListManager } from 'osf-components/components/registries/hierarchical-list';
import template from './template';

export interface HierarchicalListItemManager {
    listManager: HierarchicalListManager;
    item: NodeModel;
    isShowChildren: boolean;
    isRoot: boolean;
    toggleShowChildren: () => void;
    onChange: (event: Event) => void;
}

@layout(template)
export default class HierarchicalListItemManagerComponent extends Component {
    listManager!: HierarchicalListManager;
    item!: NodeModel;
    isShowChildren: boolean = true;
    isRoot: boolean = defaultTo(this.isRoot, false);

    @computed('listManager.selectedNodes.[]')
    get itemChecked() {
        return this.listManager.isChecked(this.item);
    }

    @action
    toggleShowChildren() {
        this.toggleProperty('isShowChildren');
    }

    @action
    onChange(event: Event) {
        if (event) {
            this.listManager.onChange(event, this.item);
            if (!this.isShowChildren) {
                this.toggleProperty('isShowChildren');
            }
        }
    }
}
