import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
 * The Existing Node Args
 */
interface ExistingNodeArgs {
    selectNode: (_: Node) => {};
}

/**
 * The Supplements Component
 */
export default class PreprintExistingNodeWidget extends Component<ExistingNodeArgs>{
    @action
    public selectNode(node: Node): void {
        this.args.selectNode(node);
    }
}
