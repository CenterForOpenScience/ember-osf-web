import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import NodeModel from 'ember-osf-web/models/node';
import { HierarchicalListManager } from 'osf-components/components/registries/hierarchical-list';

import template from './template';

@layout(template)
@tagName('')
export default class PartialRegistrationModalManagerComponent extends Component implements HierarchicalListManager {
    @service store!: DS.Store;
    rootNode!: NodeModel;

    // Private
    nodesIncludingRoot: NodeModel[] = [];
    selectedNodes: NodeModel[] = [];

    @alias('loadAllChildNodes.isRunning') loadingChildNodes!: boolean;

    @task
    async getChildren(node: NodeModel) {
        const children = await node.queryHasMany('children');
        if (children !== null) {
            let grandChildren: NodeModel[] = [];
            for (const child of children) {
                const greatGrandChildren = await taskFor(this.getChildren).perform(child);
                grandChildren = grandChildren.concat(greatGrandChildren || []);
            }
            return children.concat(grandChildren);
        }
        return null;
    }

    @task({ on: 'didReceiveAttrs' })
    async loadAllChildNodes() {
        const allChildNodesIncludingRoot = await taskFor(this.getChildren).perform(this.rootNode) || [];
        allChildNodesIncludingRoot.push(this.rootNode);
        this.set('nodesIncludingRoot', allChildNodesIncludingRoot.slice());
        this.set('selectedNodes', allChildNodesIncludingRoot.slice());
    }

    didReceiveAttrs() {
        assert('partial-registration-modal::manager requires @rootNode!', Boolean(this.rootNode));
    }

    @action
    selectAll() {
        this.set('selectedNodes', this.nodesIncludingRoot.slice());
    }

    @action
    clearAll() {
        this.set('selectedNodes', [this.rootNode]);
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
        if (currentItem.children.toArray().length > 0) {
            for (const child of currentItem.children.toArray()) {
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
