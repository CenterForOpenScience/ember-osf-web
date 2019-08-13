import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import { layout } from 'ember-osf-web/decorators/component';
import NodeModel from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';

import template from './template';

export interface PartialRegistrationModalManager {
    nodesIncludingRoot: NodeModel[];
    selectedNodes: NodeModel[];
    rootNode: NodeModel;
}

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
}) {
    @service store!: DS.Store;
    nodesIncludingRoot: NodeModel[] = defaultTo(this.nodesIncludingRoot, []);
    selectedNodes: NodeModel[] = defaultTo(this.selectedNodes, []);
    rootNode!: NodeModel;

    didReceiveAttrs(this: PartialRegistrationModalManagerComponent) {
        this.loadAllChildNodes.perform();
    }

    @action
    selectAll(this: PartialRegistrationModalManagerComponent) {
        this.set('selectedNodes', this.nodesIncludingRoot.slice());
    }

    @action
    clearAll(this: PartialRegistrationModalManagerComponent) {
        this.selectedNodes.removeObjects(this.selectedNodes.filter(item => item !== this.rootNode));
    }
}
