import { action } from '@ember/object';
import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { waitFor } from '@ember/test-waiters';

/**
 * The Action Flow Args
 */
interface ActionFlowArgs {
    manager: PreprintStateMachine;
}

/**
 * The Action Flow Component
 */
export default class ActionFlow extends Component<ActionFlowArgs>{
    @service intl!: Intl;
    manager = this.args.manager;

    public get isSubmit(): boolean {
        return this.manager.isSelected(this.manager.getReviewType);
    }

    /**
     * Calls the state machine next method
     */
    @action
    public onPrevious(): void {
        this.manager.onPrevious();
    }

    /**
     * Calls the state machine next method
     */
    @task
    @waitFor
    public async onNext(): Promise<void> {
        await taskFor(this.manager.onNext).perform();
    }

    /**
     * Calls the state machine submit method
     */
    @task
    @waitFor
    public async onSubmit(): Promise<void> {
        await taskFor(this.manager.onSubmit).perform();
    }

    /**
     * Calls the state machine delete method
     */
    @task
    @waitFor
    public async onDelete(): Promise<void> {
        await taskFor(this.manager.onDelete).perform();
    }

    /**
     * internationalize the delete modal title
     */
    public get modalTitle(): string {
        return this.intl.t('preprints.submit.action-flow.delete-modal-title',
            { singularPreprintWord: this.manager.provider.documentType.singularCapitalized });
    }

    /**
     * internationalize the delete modal body
     */
    public get modalBody(): string {
        return this.intl.t('preprints.submit.action-flow.delete-modal-body',
            { singularPreprintWord: this.manager.provider.documentType.singular});
    }
}
