import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { taskFor } from 'ember-concurrency-ts';

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
        this.args.manager.preprint.set('node', null);
        await this.args.manager.preprint.save();
        this.isSupplementAttached = false;
        this.validate();
    }

    @action
    public projectSelected(node: Node): void {
        this.args.manager.preprint.set('node', node);
        taskFor(this.saveSelectedProject).perform();
        this.isSupplementAttached = true;
        this.onCancelProjectAction();
    }

    @action
    public validate(): void {
        this.args.manager.validateSupplements(true);
    }
}
