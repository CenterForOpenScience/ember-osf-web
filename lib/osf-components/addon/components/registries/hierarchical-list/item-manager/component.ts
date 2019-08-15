import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import NodeModel from 'ember-osf-web/models/node';

import {
    PartialRegistrationModalManager,
} from 'osf-components/components/registries/partial-registration-modal/manager/component';
import template from './template';

export interface HierarchicalListItemManager {
    listManager: PartialRegistrationModalManager;
    item: NodeModel;
    isShowChildren: boolean;
    isRoot: boolean;
    toggleShowChildren: () => void;
    onChange: (event: Event) => void;
}

@layout(template)
export default class HierarchicalListItemManagerComponent extends Component {
    listManager!: PartialRegistrationModalManager;
    item!: NodeModel;
    isShowChildren: boolean = true;
    isRoot: boolean = defaultTo(this.isRoot, false);

    @computed('listManager.selectedNodes.[]')
    get itemChecked() {
        return this.listManager.selectedNodes.includes(this.item);
    }

    @action
    toggleShowChildren(this: HierarchicalListItemManagerComponent) {
        this.toggleProperty('isShowChildren');
    }

    @action
    onChange(this: HierarchicalListItemManagerComponent, event: Event) {
        if (event) {
            const target = event.target as HTMLInputElement;
            if (target.checked) {
                this.listManager.selectedNodes.pushObject(this.item);
                this.addParents(this.item);
            } else {
                this.listManager.selectedNodes.removeObject(this.item);
                this.removeChildren(this.item);
            }
            if (!this.isShowChildren) {
                this.toggleProperty('isShowChildren');
            }
        }
    }

    addParents(this: HierarchicalListItemManagerComponent, currentItem: NodeModel) {
        if (currentItem.parent.content && this.listManager.nodesIncludingRoot.includes(currentItem.parent.content)
            && !this.listManager.selectedNodes.includes(currentItem.parent.content)) {
            this.listManager.selectedNodes.pushObject(currentItem.parent.content);
            this.addParents(currentItem.parent.content);
        }
    }

    removeChildren(this: HierarchicalListItemManagerComponent, currentItem: NodeModel) {
        if (currentItem.children.content.toArray().length > 0) {
            for (const child of currentItem.children.content.toArray()) {
                if (this.listManager.selectedNodes.includes(child)) {
                    this.listManager.selectedNodes.removeObject(child);
                    this.removeChildren(child);
                }
            }
        }
    }
}
