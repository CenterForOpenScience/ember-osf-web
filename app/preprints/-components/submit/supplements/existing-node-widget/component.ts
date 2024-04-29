import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
 * The Existing Node Args
 */
interface ExistingNodeArgs {
    projectSelected: (_: Node) => {};
}

/**
 * The Supplements Component
 */
export default class PreprintExistingNodeWidget extends Component<ExistingNodeArgs>{

    @action
    public projectSelected(node: Node): void {
        this.args.projectSelected(node);
    }
}