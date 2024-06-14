import Component from '@glimmer/component';
import { action } from '@ember/object';
import NodeModel from 'ember-osf-web/models/node';

/**
 * The Existing Node Args
 */
interface ExistingNodeArgs {
    projectSelected: (_: NodeModel) => {};
}

/**
 * The Supplements Component
 */
export default class PreprintExistingNodeWidget extends Component<ExistingNodeArgs>{

    @action
    public projectSelected(node: NodeModel): void {
        this.args.projectSelected(node);
    }
}
