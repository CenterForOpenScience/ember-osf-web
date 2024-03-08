import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Status Flow Args
 */
interface StatusFlowArgs {
    manager: PreprintStateMachine;
}

export default class StatusFlow extends Component<StatusFlowArgs>{
    statusFlowIndex = this.args.manager.statusFlowIndex;
    displayAuthorAssertions = this.args.manager.displayAuthorAssertions;

    public get isTitleAndFileSelected(): boolean {
        return this.statusFlowIndex === 1;
    }

    public get isMetadataSelected(): boolean {
        return this.statusFlowIndex === 2;
    }

    public get isDisplayAuthorAssertions(): boolean {
        return this.displayAuthorAssertions;
    }

    public get isAuthorAssertionsSelected(): boolean {
        return this.statusFlowIndex === 3 && this.displayAuthorAssertions;
    }

    public get isSupplementsSelected(): boolean {
        if (this.displayAuthorAssertions && this.statusFlowIndex === 4) {
            return true;
        } else if (!this.displayAuthorAssertions && this.statusFlowIndex === 3) {
            return true;
        } else {
            return false;
        }
    }

    public get isReviewSelected(): boolean {
        if (this.displayAuthorAssertions && this.statusFlowIndex === 5) {
            return true;
        } else if (!this.displayAuthorAssertions && this.statusFlowIndex === 4) {
            return true;
        } else {
            return false;
        }
    }
}
