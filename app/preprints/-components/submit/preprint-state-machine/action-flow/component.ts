import { action } from '@ember/object';
import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

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
    public onNext(): void {
        this.manager.onNext();
    }

    /**
     * Calls the state machine submit method
     */
    @action
    public onSubmit(): void {
        this.manager.onSubmit();
    }

    /**
     * Calls the state machine delete method
     */
    @action
    public onDelete(): void {
        this.manager.onDelete();
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
