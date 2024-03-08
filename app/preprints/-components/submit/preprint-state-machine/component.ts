import Component from '@glimmer/component';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * The State Machine Args
 */
interface StateMachineArgs {
    provider: PreprintProviderModel;
}

/**
 * The Preprint State Machine
 */
export default class PreprintStateMachine extends Component<StateMachineArgs>{
    @service store!: Store;
    @service router!: RouterService;

    provider = this.args.provider;
    displayAuthorAssertions = true;
    preprint: PreprintModel;
    @tracked statusFlowIndex = 1;

    constructor(owner: unknown, args: StateMachineArgs) {
        super(owner, args);

        this.preprint = this.store.createRecord('preprint', {
            provider: this.provider,
        });
    }

    /**
     * Callback for the action-flow component
     */
    @task
    @waitFor
    public async onDelete(): Promise<void> {
        this.preprint.deleteRecord();
        await this.router.transitionTo('preprints.index', this.provider.id);
    }

    /**
     * Callback for the action-flow component
     */
    @task
    @waitFor
    public async onSave(): Promise<void> {
        await this.preprint.save();
        await this.router.transitionTo('preprints.detail', this.provider.id, this.preprint.id );
    }

    /**
     * Callback for the action-flow component
     */
    @action
    public onNext(): void {
        this.statusFlowIndex++;
    }
}
