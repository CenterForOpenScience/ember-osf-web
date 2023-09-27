import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import Intl from 'ember-intl/services/intl';
import PreprintModel from 'ember-osf-web/models/preprint';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import { alias } from '@ember/object/computed';

const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';
const PENDING_WITHDRAWAL = 'pendingWithdrawal';
const WITHDRAWAL_REJECTED = 'withdrawalRejected';
const WITHDRAWN = 'withdrawn';

const PRE_MODERATION = 'pre-moderation';
const POST_MODERATION = 'post-moderation';

const STATUS = {
    [PENDING]: 'components.preprint-status-banner.pending',
    [ACCEPTED]: 'components.preprint-status-banner.accepted',
    [REJECTED]: 'components.preprint-status-banner.rejected',
    [PENDING_WITHDRAWAL]: 'components.preprint-status-banner.pending_withdrawal',
    [WITHDRAWAL_REJECTED]: 'components.preprint-status-banner.withdrawal_rejected',
};

const MESSAGE = {
    [PRE_MODERATION]: 'components.preprint-status-banner.message.pending_pre',
    [POST_MODERATION]: 'components.preprint-status-banner.message.pending_post',
    [ACCEPTED]: 'components.preprint-status-banner.message.accepted',
    [REJECTED]: 'components.preprint-status-banner.message.rejected',
    [PENDING_WITHDRAWAL]: 'components.preprint-status-banner.message.pending_withdrawal',
    [WITHDRAWAL_REJECTED]: 'components.preprint-status-banner.message.withdrawal_rejected',
    [WITHDRAWN]: 'components.preprint-status-banner.message.withdrawn',
};

const WORKFLOW = {
    [PRE_MODERATION]: 'global.pre_moderation',
    [POST_MODERATION]: 'global.post_moderation',
};

const CLASS_NAMES = {
    PRE_MODERATION: 'preprint-status-pending-pre',
    POST_MODERATION: 'preprint-status-pending-post',
    ACCEPTED: 'preprint-status-accepted',
    REJECTED: 'preprint-status-rejected',
    PENDING_WITHDRAWAL: 'preprint-status-rejected',
    WITHDRAWAL_REJECTED: 'preprint-status-rejected',
    WITHDRAWN: 'preprint-status-withdrawn',
};

interface InputArgs {
    submission: PreprintModel;
    isWithdrawn: boolean;
}

export default class PreprintStatusBanner extends Component<InputArgs>{
    @service intl!: Intl;
    @service theme!: Theme;

    submission = this.args.submission;
    isWithdrawn = this.args.isWithdrawn;

    isPendingWithdrawal = false;
    isWithdrawalRejected = false;

    // translations
    labelModeratorFeedback = 'components.preprint-status-banner.feedback.moderator_feedback';
    moderator = 'components.preprint-status-banner.feedback.moderator';
    baseMessage = 'components.preprint-status-banner.message.base';

    classNames = ['preprint-status-component'];
    classNameBindings = ['getClassName'];

    latestAction: ReviewActionModel | undefined;

    @alias('latestAction.comment') reviewerComment: string | undefined;
    @alias('latestAction.creator.fullName') reviewerName: string | undefined;

    /**
     *
     * @param owner The owner
     * @param args The args
     */
    constructor(owner: unknown, args: InputArgs) {
        super(owner, args);

        this.latestAction = undefined;

        this.loadPreprintState();

    }

    public getClassName(): string {
        if (this.isPendingWithdrawal) {
            return CLASS_NAMES['PENDING_WITHDRAWAL'];
        } else if (this.isWithdrawn) {
            return CLASS_NAMES['WITHDRAWN'];
        } else if (this.isWithdrawalRejected) {
            return CLASS_NAMES['WITHDRAWAL_REJECTED'];
        } else {
            return this.submission.reviewsState === PENDING ?
                CLASS_NAMES[this.submission.provider.reviewsWorkflow] :
                CLASS_NAMES[this.submission.reviewsState];
        }
    }

    public bannerContent(): string {
        if (this.isPendingWithdrawal) {
            return this.intl.t(this.statusExplanation, { documentType: this.submission.provider.documentType });
        } else if (this.isWithdrawn) {
            return this.intl.t(MESSAGE[WITHDRAWN], { documentType: this.submission.provider.documentType });
        } else if (this.isWithdrawalRejected) {
            return this.intl.t(MESSAGE[WITHDRAWAL_REJECTED], { documentType: this.submission.provider.documentType });
        } else {
            const tName = this.theme.isProvider ?
                this.theme.provider?.name :
                this.intl.t('global.brand_name');
            const tWorkflow = this.intl.t(this.workflow);
            const tStatusExplanation = this.intl.t(this.statusExplanation);
            // eslint-disable-next-line max-len
            return `${this.intl.t(this.baseMessage), { name: tName, reviewsWorkflow: tWorkflow, documentType: this.submission.provider.documentType }} ${tStatusExplanation}`;
        }
    }

    feedbackBaseMessage(): string {
        if (this.isWithdrawalRejected) {
            return '';
        }
        // eslint-disable-next-line max-len
        return this.intl.t('components.preprint-status-banner.feedback.base', { documentType: this.submission.provider.documentType });
    }

    private get statusExplanation(): string {
        if (this.isPendingWithdrawal) {
            return MESSAGE[PENDING_WITHDRAWAL];
        } else if (this.isWithdrawalRejected) {
            return MESSAGE[WITHDRAWAL_REJECTED];
        } else {
            return this.submission.reviewsState === PENDING ?
                MESSAGE[this.submission.provider.reviewsWorkflow] :
                MESSAGE[this.submission.reviewsState];
        }
    }

    status(): string {
        let currentState = this.submission.reviewsState;
        if (this.isPendingWithdrawal) {
            currentState = PENDING_WITHDRAWAL;
        } else if (this.isWithdrawalRejected) {
            currentState = WITHDRAWAL_REJECTED;
        }
        return STATUS[currentState];
    }

    public get icon(): string {
        let currentState = this.submission.reviewsState;
        if (this.isPendingWithdrawal) {
            currentState = PENDING_WITHDRAWAL;
        } else if (this.isWithdrawalRejected) {
            currentState = WITHDRAWAL_REJECTED;
        } else if (this.isWithdrawn) {
            currentState = WITHDRAWN;
        }
        return this.getIcon(currentState);
    }

    private get workflow(): string {
        return WORKFLOW[this.submission.provider.reviewsWorkflow];
    }

    @task
    @waitFor
    async loadPreprintState()  {
        if (this.isWithdrawn) {
            return;
        }
        const submissionActions = await this.submission.reviewActions;
        const latestSubmissionAction = submissionActions.firstObject;
        const withdrawalRequests = await this.submission.requests;
        const withdrawalRequest = withdrawalRequests.firstObject;
        if (withdrawalRequest) {
            const requestActions = await withdrawalRequest.queryHasMany('actions', {
                sort: '-modified',
            });
            const latestRequestAction = requestActions.firstObject;
            if (latestRequestAction && latestRequestAction.actionTrigger === 'reject') {
                this.isWithdrawalRejected = true;
                this.latestAction = latestRequestAction;
                return;
            } else {
                this.isPendingWithdrawal = true;
                return;
            }
        }
        if (this.submission.provider.reviewsCommentsPrivate) {
            return;
        }
        this.latestAction = latestSubmissionAction;
    }

    /**
     * getIcon
     *
     * @description Determines the correct icon from the current state
     * @param currentState The current state as a string
     * @returns the icon associated with the current state
     */
    private getIcon(currentState: string): string {
        switch(currentState) {
        case PENDING: {
            return 'fa-hourglass-o';
        }
        case ACCEPTED: {
            return 'fa-check-circle-o';
        }
        case REJECTED: {
            return 'fa-times-circle-o';
        }
        case PENDING_WITHDRAWAL: {
            return 'fa-hourglass-o';
        }
        case WITHDRAWAL_REJECTED: {
            return 'fa-times-circle-o';
        }
        default: {
            // [WITHDRAWN]: 'fa-exclamation-triangle',
            return 'fa-exclamation-triangle';
        }
        }
    }
}
