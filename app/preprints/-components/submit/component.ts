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
 * The Submit component
 */
export default class Submit extends Component<SubmitArgs>{
    public get isTitleAndAbstractActive(): boolean {
        return this.isSelected(PreprintStatusTypeEnum.titleAndAbstract);
    }

    public get isFileActive(): boolean {
        return this.isSelected(PreprintStatusTypeEnum.file);
    }

    public get isMetadataActive(): boolean {
        return this.isSelected(PreprintStatusTypeEnum.metadata);
    }

    public get isAuthorAssertionsActive(): boolean {
        return this.isSelected(PreprintStatusTypeEnum.authorAssertions);
    }

    public get isSupplementsActive(): boolean {
        return this.isSelected(PreprintStatusTypeEnum.supplements);
    }

    public get isReviewActive(): boolean {
        return this.isSelected(PreprintStatusTypeEnum.review);
    }

    private isSelected(type: string): boolean {
        return this.args.manager.isSelected(type);
    }
}
