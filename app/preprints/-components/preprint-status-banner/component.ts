import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import Intl from 'ember-intl/services/intl';
import PreprintModel from 'ember-osf-web/models/preprint';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { alias } from '@ember/object/computed';
import PreprintRequestActionModel from 'ember-osf-web/models/preprint-request-action';
import { taskFor } from 'ember-concurrency-ts';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import { tracked } from '@glimmer/tracking';
import { ReviewsState } from 'ember-osf-web/models/provider';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import Media from 'ember-responsive';

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
STATUS[PENDING]= 'preprints.detail.status_banner.pending';
STATUS[ACCEPTED]= 'preprints.detail.status_banner.accepted';
STATUS[REJECTED]= 'preprints.detail.status_banner.rejected';
STATUS[PENDING_WITHDRAWAL]= 'preprints.detail.status_banner.pending_withdrawal';
STATUS[WITHDRAWAL_REJECTED]= 'preprints.detail.status_banner.withdrawal_rejected';

const MESSAGE = Object({});
MESSAGE[PRE_MODERATION] =  'preprints.detail.status_banner.message.pending_pre';
MESSAGE[POST_MODERATION] =  'preprints.detail.status_banner.message.pending_post';
MESSAGE[ACCEPTED] =  'preprints.detail.status_banner.message.accepted';
MESSAGE[REJECTED] =  'preprints.detail.status_banner.message.rejected';
MESSAGE[PENDING_WITHDRAWAL] =  'preprints.detail.status_banner.message.pending_withdrawal';
MESSAGE[WITHDRAWAL_REJECTED] =  'preprints.detail.status_banner.message.withdrawal_rejected';
MESSAGE[WITHDRAWN] =  'preprints.detail.status_banner.message.withdrawn';
MESSAGE[UNKNOWN] =  'preprints.detail.status_banner.message.withdrawn';

const WORKFLOW = Object({});
WORKFLOW[PRE_MODERATION] = 'preprints.detail.status_banner.pre_moderation';
WORKFLOW[POST_MODERATION] = 'preprints.detail.status_banner.post_moderation';
WORKFLOW[UNKNOWN] = 'preprints.detail.status_banner.post_moderation';

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
ICONS[PENDING] = 'hourglass';
ICONS[ACCEPTED] = 'check-circle';
ICONS[REJECTED] = 'times-circle';
ICONS[PENDING_WITHDRAWAL] = 'hourglass';
ICONS[WITHDRAWAL_REJECTED] = 'times-circle';
ICONS[WITHDRAWN] = 'exclamation-triangle';
ICONS[UNKNOWN] = 'exclamation-triangle';

interface InputArgs {
    submission: PreprintModel;
}

export default class PreprintStatusBanner extends Component<InputArgs>{
    @service intl!: Intl;
    @service theme!: Theme;
    @service media!: Media;

    submission = this.args.submission;
    isWithdrawn = this.args.submission.isWithdrawn;

    provider: PreprintProviderModel | undefined;

    @tracked displayComment = false;
    isPendingWithdrawal = false;
    isWithdrawalRejected = false;

    // translations
    labelModeratorFeedback = 'preprints.detail.status_banner.feedback.moderator_feedback';
    moderator = 'preprints.detail.status_banner.feedback.moderator';
    baseMessage = 'preprints.detail.status_banner.message.base';

    latestAction: PreprintRequestActionModel | ReviewActionModel |  undefined;

    @alias('latestAction.comment') reviewerComment: string | undefined;
    @alias('latestAction.creator.fullName') reviewerName: string | undefined;

    constructor(owner: unknown, args: InputArgs) {
        super(owner, args);

        taskFor(this.loadPreprintState).perform();
    }

    public get getClassName(): string {
        if (this.isPendingWithdrawal) {
            return CLASS_NAMES[PENDING_WITHDRAWAL];
        } else if (this.isWithdrawn) {
            return CLASS_NAMES[WITHDRAWN];
        } else if (this.isWithdrawalRejected) {
            return CLASS_NAMES[WITHDRAWAL_REJECTED];
        } else {
            return this.submission.reviewsState === PENDING ?
                CLASS_NAMES[this.provider?.reviewsWorkflow || UNKNOWN] :
                CLASS_NAMES[this.submission.reviewsState];
        }
    }

    public get bannerContent(): string {
        if (this.isPendingWithdrawal) {
            return this.intl.t(this.statusExplanation, { documentType: this.provider?.documentType.singular });
        } else if (this.isWithdrawn) {
            return this.intl.t(MESSAGE[WITHDRAWN], { documentType: this.provider?.documentType.singular });
        } else if (this.isWithdrawalRejected) {
            return this.intl.t(MESSAGE[WITHDRAWAL_REJECTED], { documentType: this.provider?.documentType.singular });
        } else {
            const tName = this.theme.isProvider ?
                this.theme.provider?.name :
                this.intl.t('preprints.detail.status_banner.brand_name');
            const tWorkflow = this.intl.t(this.workflow);
            const tStatusExplanation = this.intl.t(this.statusExplanation);
            const base = (this.intl.t(this.baseMessage, {
                name: tName,
                reviewsWorkflow:
                tWorkflow,
                documentType: this.provider?.documentType.singular,
            }));
            return `${base} ${tStatusExplanation}`;
        }
    }

    private get statusExplanation(): string {
        if (this.isPendingWithdrawal) {
            return MESSAGE[PENDING_WITHDRAWAL];
        } else if (this.isWithdrawalRejected) {
            return MESSAGE[WITHDRAWAL_REJECTED];
        } else {
            return this.submission.reviewsState === PENDING ?
                MESSAGE[this.provider?.reviewsWorkflow || UNKNOWN ] :
                MESSAGE[this.submission.reviewsState];
        }
    }

    public get status(): string {
        let currentState = this.submission.reviewsState;
        if (this.isPendingWithdrawal) {
            currentState = ReviewsState.PENDING_WITHDRAWAL;
        } else if (this.isWithdrawalRejected) {
            currentState = ReviewsState.WITHDRAWAL_REJECTED;
        }
        return STATUS[currentState];
    }

    public get icon(): string {
        let currentState = this.submission.reviewsState;
        if (this.isPendingWithdrawal) {
            currentState = ReviewsState.PENDING_WITHDRAWAL;
        } else if (this.isWithdrawalRejected) {
            currentState = ReviewsState.WITHDRAWAL_REJECTED;
        } else if (this.isWithdrawn) {
            currentState = ReviewsState.WITHDRAWN;
        }
        return ICONS[currentState];
    }

    private get workflow(): string {
        return WORKFLOW[this.provider?.reviewsWorkflow || UNKNOWN];
    }

    @task
    @waitFor
    async loadPreprintState()  {
        this.provider = await this.submission.provider;

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

        if (this.provider.reviewsCommentsPrivate) {
            return;
        }

        this.latestAction = latestSubmissionAction;
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
