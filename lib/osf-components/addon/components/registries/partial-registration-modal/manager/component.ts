import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import { layout } from 'ember-osf-web/decorators/component';
import NodeModel from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';

import { HierarchicalListManager } from 'osf-components/components/registries/hierarchical-list';
import template from './template';

@layout(template)
export default class PartialRegistrationModalManagerComponent extends Component.extend({
    loadAllChildNodes: task(function *(this: PartialRegistrationModalManagerComponent) {
        let allChildNodesIncludingRoot = yield this.store.query('node', {
            filter: {
                root: this.rootNode.id,
            },
        });
        allChildNodesIncludingRoot = allChildNodesIncludingRoot.toArray();
        this.set('nodesIncludingRoot', allChildNodesIncludingRoot.slice());
        this.set('selectedNodes', allChildNodesIncludingRoot.slice());
    }),
}) implements HierarchicalListManager {
    @service store!: DS.Store;
    nodesIncludingRoot: NodeModel[] = defaultTo(this.nodesIncludingRoot, []);
    selectedNodes: NodeModel[] = defaultTo(this.selectedNodes, []);
    rootNode!: NodeModel;
    isOpen: boolean = defaultTo(this.isOpen, false);
    renderInPlace: boolean = defaultTo(this.renderInPlace, false);

    didReceiveAttrs() {
        this.loadAllChildNodes.perform();
    }

    @action
    selectAll() {
        this.set('selectedNodes', this.nodesIncludingRoot.slice());
    }

    @action
    clearAll() {
        this.selectedNodes.removeObjects(this.selectedNodes.filter(item => item !== this.rootNode));
    }

    @action
    onChange(event: Event, item: NodeModel) {
        if (event && item) {
            const target = event.target as HTMLInputElement;
            if (target.checked) {
                this.addNode(item);
            } else {
                this.removeNode(item);
            }
        }
    }

    @action
    isChecked(node: NodeModel) {
        return this.selectedNodes.includes(node);
    }

    addParents(currentItem: NodeModel) {
        if (currentItem.parent.content && this.nodesIncludingRoot.includes(currentItem.parent.content)
            && !this.selectedNodes.includes(currentItem.parent.content)) {
            this.selectedNodes.pushObject(currentItem.parent.content);
            this.addParents(currentItem.parent.content);
        }
    }

    removeChildren(currentItem: NodeModel) {
        if (currentItem.children.content.toArray().length > 0) {
            for (const child of currentItem.children.content.toArray()) {
                if (this.selectedNodes.includes(child)) {
                    this.selectedNodes.removeObject(child);
                    this.removeChildren(child);
                }
            }
        }
    }

    addNode(node: NodeModel) {
        this.selectedNodes.pushObject(node);
        this.addParents(node);
    }

    removeNode(node: NodeModel) {
        this.selectedNodes.removeObject(node);
        this.removeChildren(node);
    }
}
