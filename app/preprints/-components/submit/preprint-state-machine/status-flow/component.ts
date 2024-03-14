import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Status Flow Args
 */
interface StatusFlowArgs {
    manager: PreprintStateMachine;
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class StatusFlow extends Component<StatusFlowArgs>{ }
