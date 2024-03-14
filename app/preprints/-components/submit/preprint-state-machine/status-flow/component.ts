import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Status Flow Args
 */
interface StatusFlowArgs {
    manager: PreprintStateMachine;
}

export default class StatusFlow extends Component<StatusFlowArgs> {

    public get displayAuthorAssertions(): boolean {
        return this.args.manager.displayAuthorAssertions;
    }

}
