import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import Intl from 'ember-intl/services/intl';
import PreprintModel from 'ember-osf-web/models/preprint';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import { alias } from '@ember/object/computed';

const UNKNOWN = 'unknown';
const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';
const PENDING_WITHDRAWAL = 'pendingWithdrawal';
const WITHDRAWAL_REJECTED = 'withdrawalRejected';
const WITHDRAWN = 'withdrawn';

const PRE_MODERATION = 'pre-moderation';
const POST_MODERATION = 'post-moderation';

const STATUS = Object({});
STATUS[PENDING]= 'components.preprint-status-banner.pending';
STATUS[ACCEPTED]= 'components.preprint-status-banner.accepted';
STATUS[REJECTED]= 'components.preprint-status-banner.rejected';
STATUS[PENDING_WITHDRAWAL]= 'components.preprint-status-banner.pending_withdrawal';
STATUS[WITHDRAWAL_REJECTED]= 'components.preprint-status-banner.withdrawal_rejected';

const MESSAGE = Object({});
MESSAGE[PRE_MODERATION] =  'components.preprint-status-banner.message.pending_pre';
MESSAGE[POST_MODERATION] =  'components.preprint-status-banner.message.pending_post';
MESSAGE[ACCEPTED] =  'components.preprint-status-banner.message.accepted';
MESSAGE[REJECTED] =  'components.preprint-status-banner.message.rejected';
MESSAGE[PENDING_WITHDRAWAL] =  'components.preprint-status-banner.message.pending_withdrawal';
MESSAGE[WITHDRAWAL_REJECTED] =  'components.preprint-status-banner.message.withdrawal_rejected';
MESSAGE[WITHDRAWN] =  'components.preprint-status-banner.message.withdrawn';
MESSAGE[UNKNOWN] =  'components.preprint-status-banner.message.withdrawn';

const WORKFLOW = Object({});
WORKFLOW[PRE_MODERATION] = 'global.pre_moderation';
WORKFLOW[POST_MODERATION] = 'global.post_moderation';
WORKFLOW[UNKNOWN] = 'global.post_moderation';

const CLASS_NAMES = Object({});
CLASS_NAMES[PRE_MODERATION] = 'preprint-status-pending-pre';
CLASS_NAMES[POST_MODERATION] =  'preprint-status-pending-post';
CLASS_NAMES[ACCEPTED] =  'preprint-status-accepted';
CLASS_NAMES[REJECTED] =  'preprint-status-rejected';
CLASS_NAMES[PENDING_WITHDRAWAL] =  'preprint-status-rejected';
CLASS_NAMES[WITHDRAWAL_REJECTED] =  'preprint-status-rejected';
CLASS_NAMES[WITHDRAWN] =  'preprint-status-withdrawn';
CLASS_NAMES[UNKNOWN] =  'preprint-status-withdrawn';

const ICONS = Object({});
ICONS[PENDING] = 'fa-hourglass-o';
ICONS[ACCEPTED] = 'fa-check-circle-o';
ICONS[REJECTED] = 'fa-times-circle-o';
ICONS[PENDING_WITHDRAWAL] = 'fa-hourglass-o';
ICONS[WITHDRAWAL_REJECTED] = 'fa-times-circle-o';
ICONS[WITHDRAWN] = 'fa-exclamation-triangle';
ICONS[UNKNOWN] = 'fa-exclamation-triangle';

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
                CLASS_NAMES[this.submission?.provider?.reviewsWorkflow || UNKNOWN] :
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
                MESSAGE[this.submission?.provider?.reviewsWorkflow || UNKNOWN ] :
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
        return ICONS[currentState];
    }

    private get workflow(): string {
        return WORKFLOW[this.submission?.provider?.reviewsWorkflow || UNKNOWN];
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

}
