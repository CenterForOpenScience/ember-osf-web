import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Review Args
 */
interface ReviewArgs {
    manager: PreprintStateMachine;
}

/**
 * The Review Component
 */
export default class Review extends Component<ReviewArgs>{
    constructor(owner: unknown, args: ReviewArgs) {
        super(owner, args);
    }
}
