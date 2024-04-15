import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

/**
 * The Supplements Args
 */
interface SupplementsArgs {
    manager: PreprintStateMachine;
}

/**
 * The Supplements Component
 */
export default class Supplements extends Component<SupplementsArgs>{
    @tracked displayExistingNodeWidget = false;
    @tracked displayCreateNodeWidget = false;
    @tracked displayCancelButton = false;

    private isDisplayCancelButton(): void {
        this.displayCancelButton = this.displayExistingNodeWidget ||
        this.displayCreateNodeWidget;
    }

    @action
    public onCancelProjectAction(): void {
        this.displayExistingNodeWidget = false;
        this.displayCreateNodeWidget = false;
        this.isDisplayCancelButton();
    }

    @action
    public onConnectOsfProject(): void {
        this.displayExistingNodeWidget = true;
        this.displayCreateNodeWidget = false;
        this.isDisplayCancelButton();
    }

    @action
    public onCreateOsfProject(): void {
        this.displayCreateNodeWidget = true;
        this.displayExistingNodeWidget = false;
        this.isDisplayCancelButton();
    }

    @action
    // public selectNode(node: Node): void {
    public selectNode(): void {
        this.validate();
    }

    @action
    public validate(): void {
        this.args.manager.validateSupplements(true);
    }
}
