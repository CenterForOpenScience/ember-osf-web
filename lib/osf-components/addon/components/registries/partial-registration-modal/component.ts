import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import NodeModel from 'ember-osf-web/models/node';
import { HierarchicalListManager } from 'osf-components/components/registries/hierarchical-list';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class PartialRegistrationModal extends Component {
    // Required
    manager!: HierarchicalListManager;

    // Optional
    onContinue?: (nodes: NodeModel[]) => void;

    didReceiveAttrs() {
        assert('partial-registration-modal requires @manager!', Boolean(this.manager));
    }

    @action
    continue() {
        const nodes = this.manager.selectedNodes;
        if (this.onContinue) {
            this.onContinue(nodes);
        }
    }
}
