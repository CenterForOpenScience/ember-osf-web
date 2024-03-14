import Component from '@glimmer/component';
import PreprintStateMachine, { PreprintStatusTypeEnum } from
    'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Submit Args
 */
interface SubmitArgs {
    manager: PreprintStateMachine;
}

/**
 * The Preprint State Machine
 */
export default class Submit extends Component<SubmitArgs>{
    constructor(owner: unknown, args: SubmitArgs) {
        super(owner, args);
    }

    public get isTitleAndFileActive(): boolean {
        return this.isSelected(PreprintStatusTypeEnum.titleAndFile);
    }

    public get isMetadataActice(): boolean {
        return this.isSelected(PreprintStatusTypeEnum.metadata);
    }

    private isSelected(type: string): boolean {
        return this.args.manager.isSelected(type);
    }
}
