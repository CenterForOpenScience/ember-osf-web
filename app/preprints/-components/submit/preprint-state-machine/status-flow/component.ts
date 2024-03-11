import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';

/**
 * The Status Flow Args
 */
interface StatusFlowArgs {
    manager: PreprintStateMachine;
}

export default class StatusFlow extends Component<StatusFlowArgs>{
    /**
     * Simple getter to reduce typing
     */
    private get displayAuthorAssertions(): boolean {
        return this.args.manager.displayAuthorAssertions;
    }

    /**
     * Simple getter to reduce typing
     */
    private get statusFlowIndex(): number {
        return this.args.manager.statusFlowIndex;
    }

    public get isTitleAndFileSelected(): boolean {
        return this.statusFlowIndex === 1;
    }

    public get isTitleAndFileFinished(): boolean {
        return this.isFinished(1);
    }

    public get isTitleAndFileDisabled(): boolean {
        return this.statusFlowIndex === 1;
    }

    public get isMetadataSelected(): boolean {
        return this.statusFlowIndex === 2;
    }

    public get isMetadataFinished(): boolean {
        return this.isFinished(2);
    }

    public get isMetadataDisabled(): boolean {
        return this.statusFlowIndex === 2;
    }

    public get isDisplayAuthorAssertions(): boolean {
        return this.displayAuthorAssertions;
    }

    public get isAuthorAssertionsSelected(): boolean {
        return this.statusFlowIndex === 3 && this.displayAuthorAssertions;
    }

    public get isAuthorAssertionsFinished(): boolean {
        return this.isFinished();
    }

    private isFinished(index?: number): boolean {
        if (this.displayAuthorAssertions && this.statusFlowIndex > 3) {
            return true;
        } else if (!this.displayAuthorAssertions && this.statusFlowIndex > 2) {
            return true;
        } else if (this.statusFlowIndex > index!) {
            return true;
        } else {
            return false;
        }
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

    public get isSupplementsFinished(): boolean {
        return this.isFinished();
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

    @action
    public onClickMetadata(): void {
        if (this.statusFlowIndex > 2) {
            this.onClickStep(2);
        }
    }

    @action
    public onClickTitleAndFile(): void {
        if (this.statusFlowIndex > 1) {
            this.onClickStep(1);
        }
    }

    private onClickStep(index: number): void {
        this.args.manager.onClickStep(index);
    }
}
