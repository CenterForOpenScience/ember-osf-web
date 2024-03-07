import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Submit Args
 */
interface SubmitArgs {
    manager: PreprintStateMachine;
}

/**
 * The Preprint State Machine
 */
export default class Submit extends Component<SubmitArgs>{
    constructor(owner: unknown, args: SubmitArgs) {
        super(owner, args);
    }
}
