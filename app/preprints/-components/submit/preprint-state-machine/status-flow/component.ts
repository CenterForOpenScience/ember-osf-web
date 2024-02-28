import Component from '@glimmer/component';

/**
 * The Submit Args
 */
interface StatusFlowArgs {
    statusFlowIndex: number;
    displayAuthorAssertions: boolean;
}

export default class StatusFlow extends Component<StatusFlowArgs>{
    statusFlowIndex = this.args.statusFlowIndex;
    displayAuthorAssertions = this.args.displayAuthorAssertions;

    public get isDisplayTitleAndFile(): boolean {
        return this.statusFlowIndex === 1;
    }

    public get isDisplayMetadata(): boolean {
        return this.statusFlowIndex === 2;
    }

    public get isDisplayAuthorAssertions(): boolean {
        return this.statusFlowIndex === 3 && this.displayAuthorAssertions;
    }

    public get isDisplaySupplements(): boolean {
        if (this.displayAuthorAssertions && this.statusFlowIndex === 4) {
            return true;
        } else if (!this.displayAuthorAssertions && this.statusFlowIndex === 3) {
            return true;
        } else {
            return false;
        }
    }

    public get isDisplayReview(): boolean {
        if (this.displayAuthorAssertions && this.statusFlowIndex === 5) {
            return true;
        } else if (!this.displayAuthorAssertions && this.statusFlowIndex === 4) {
            return true;
        } else {
            return false;
        }
    }
}
