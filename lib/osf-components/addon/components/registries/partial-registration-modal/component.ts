import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import NodeModel from 'ember-osf-web/models/node';
import { HierarchicalListManager } from 'osf-components/components/registries/hierarchical-list';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class PartialRegistrationModal extends Component {
    modalManager!: HierarchicalListManager;

    onContinue?: (nodes: NodeModel[]) => void;

    @action
    continue() {
        const nodes = this.modalManager.selectedNodes;
        if (this.onContinue) {
            this.onContinue(nodes);
        }
    }
}
