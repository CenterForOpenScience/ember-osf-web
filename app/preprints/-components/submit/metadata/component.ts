import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Metadata Args
 */
interface MetadataArgs {
    manager: PreprintStateMachine;
}

/**
 * The Metadata Component
 */
export default class Metadata extends Component<MetadataArgs>{
    constructor(owner: unknown, args: MetadataArgs) {
        super(owner, args);
    }
}
