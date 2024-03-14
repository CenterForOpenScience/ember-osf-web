import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Status Flow Display Args
 */
interface StatusFlowDisplayArgs {
    manager: PreprintStateMachine;
    type: string;
}

export default class StatusFlowDisplay extends Component<StatusFlowDisplayArgs>{
    type = this.args.type;

    private get manager(): PreprintStateMachine {
        return this.args.manager;
    }

    public get displayStatusType(): boolean {
        return this.manager.displayStatusType(this.type);
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

    public onClick(): void {
        this.args.manager.onClickStep(this.type);
    }
}
