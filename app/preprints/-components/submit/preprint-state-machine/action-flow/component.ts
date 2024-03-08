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

    /**
     * Calls the state machine next method
     */
    public onNext(): void {
        this.manager.onNext();
    }

    /**
     * Calls the state machine delete method
     */
    public onDelete(): void {
        this.manager.onDelete();
    }
}
