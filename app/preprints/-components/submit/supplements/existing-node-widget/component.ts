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

    collection = [];

    @action
    public projectSelected(node: Node): void {
        // console.log(node);
        this.args.selectNode(node);
    }

    @action
    // public isProjectSelectorValid(valid: boolean): void {
    public isProjectSelectorValid(): void {
        // console.log(valid);
    }


}
