import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Author Assertions Args
 */
interface AuthorAssertionsArgs {
    manager: PreprintStateMachine;
}

/**
 * The Author Assertions Component
 */
export default class AuthorAssertions extends Component<AuthorAssertionsArgs>{
    constructor(owner: unknown, args: AuthorAssertionsArgs) {
        super(owner, args);
    }
}
