import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { ValidationObject } from 'ember-changeset-validations';

/**
 * The Supplements Args
 */
interface SupplementsArgs {
    manager: PreprintStateMachine;
}

interface SupplementsForm{
    node: Node;
}

const SupplementFormValidation: ValidationObject<SupplementsForm> = {
    node: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
};

/**
 * The Supplements Component
 */
export default class Supplements extends Component<SupplementsArgs>{
    @tracked displayExistingNodeWidget = false;
    @tracked displayCreateNodeWidget = false;

    supplementFormChangeset = buildChangeset(this.args.manager.preprint, SupplementFormValidation);

    public get isDisplayCancelButton(): boolean {
        return this.displayExistingNodeWidget ||
        this.displayCreateNodeWidget;
    }

    @action
    public onCancelProjectAction(): void {
        this.displayExistingNodeWidget = false;
        this.displayCreateNodeWidget = false;
    }

    @action
    public onConnectOsfProject(): void {
        this.displayExistingNodeWidget = true;
        this.displayCreateNodeWidget = false;
    }

    @action
    public onCreateOsfProject(): void {
        this.displayCreateNodeWidget = true;
        this.displayExistingNodeWidget = false;
    }

    @action
    public projectSelected(node: Node): void {
        this.supplementFormChangeset.set('node', node);
        this.validate();
    }

    @action
    public validate(): void {
        this.supplementFormChangeset.validate();
        if (this.supplementFormChangeset.isInvalid) {
            this.args.manager.validateSupplements(false);
            return;
        }
        this.supplementFormChangeset.execute();
        this.args.manager.validateSupplements(true);
    }
}
