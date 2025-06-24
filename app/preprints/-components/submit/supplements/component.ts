import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { taskFor } from 'ember-concurrency-ts';
import NodeModel from 'ember-osf-web/models/node';
import Toast from 'ember-toastr/services/toast';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

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
    @service toast!: Toast;
    @service intl!: Intl;
    @tracked displayExistingNodeWidget = false;
    @tracked isSupplementAttached = false;
    @tracked isModalOpen = false;

    constructor(owner: unknown, args: SupplementsArgs) {
        super(owner, args);

        if(this.args.manager.preprint.get('node')?.get('id')) {
            this.isSupplementAttached = true;
        }

        this.args.manager.validateSupplements(true);
    }

    public get isDisplayCancelButton(): boolean {
        return this.displayExistingNodeWidget;
    }

    @action
    public onCancelProjectAction(): void {
        this.displayExistingNodeWidget = false;
        this.isModalOpen = false;
    }

    @action
    public onConnectOsfProject(): void {
        this.displayExistingNodeWidget = true;
    }

    @action
    public onCreateOsfProject(): void {
        this.displayExistingNodeWidget = false;
        this.isModalOpen = true;
    }

    @task
    @waitFor
    private async saveSelectedProject(): Promise<void> {
        await this.args.manager.preprint.save();
        this.validate();
    }

    @task
    @waitFor
    public async removeSelectedProject(): Promise<void> {
        try {
            this.validate(false);
            await this.args.manager.preprint.removeM2MRelationship('node'); // Remove relationship
            // Remove relationship on the node side, this only clears the cache locally
            this.args.manager.preprint.node.get('preprints')
                .removeObject(this.args.manager.preprint);
            this.isSupplementAttached = false;
            this.validate();
        } catch (error) {
            this.toast.error(this.intl.t('preprints.submit.step-supplements.failed-removal'));
        }
    }

    @action
    public projectSelected(node: NodeModel): void {
        this.args.manager.preprint.set('node', node);
        taskFor(this.saveSelectedProject).perform();
        this.isSupplementAttached = true;
        this.onCancelProjectAction();
    }

    @action
    public validate(isValid = true): void {
        this.args.manager.validateSupplements(isValid);
    }
}
