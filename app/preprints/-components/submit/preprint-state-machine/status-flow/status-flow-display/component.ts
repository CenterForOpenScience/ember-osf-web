import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Status Flow Display Args
 */
interface StatusFlowDisplayArgs {
    manager: PreprintStateMachine;
    isMobile: boolean;
    leftNavToggle: () => void;
    type: string;
}

export default class StatusFlowDisplay extends Component<StatusFlowDisplayArgs>{

    type = this.args.type;

    private get manager(): PreprintStateMachine {
        return this.args.manager;
    }

    public get shouldDisplayStatusType(): boolean {
        let isDisplay = this.manager.shouldDisplayStatusType(this.type);
        if (this.args.isMobile) {
            isDisplay &&= this.isSelected;
        }

        return isDisplay;
    }

    public get getStatusTitle(): string {
        return this.manager.getStatusTitle(this.type);
    }

    public get isSelected(): boolean {
        return this.manager.isSelected(this.type);
    }

    public get isFinished(): boolean {
        return this.manager.isFinished(this.type);
    }

    public get isDisabled(): boolean {
        return this.manager.isDisabled(this.type);
    }

    public get getAnalytics(): string {
        return this.manager.getAnalytics(this.type);
    }

    public get getFaIcon(): string {
        return this.args.manager.getFaIcon(this.type);
    }

    public onClick(): void {
        if (!this.args.isMobile) {
            this.args.leftNavToggle();
        }
        this.args.manager.onClickStep(this.type);
    }

    public get getLinkClass(): string {
        if (this.isSelected) {
            return 'selected';
        } else {
            return 'unfinished';
        }
    }
}
