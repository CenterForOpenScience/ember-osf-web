import { action } from '@ember/object';
import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

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
}
