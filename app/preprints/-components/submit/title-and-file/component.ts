import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The TitleAndFile Args
 */
interface TitleAndFileArgs {
    manager: PreprintStateMachine;
}

/**
 * The Title And File Component
 */
export default class TitleAndFile extends Component<TitleAndFileArgs>{
    constructor(owner: unknown, args: TitleAndFileArgs) {
        super(owner, args);
    }
}
