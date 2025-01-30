import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import Intl from 'ember-intl/services/intl';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintRequestActionModel from 'ember-osf-web/models/preprint-request-action';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import { tracked } from '@glimmer/tracking';
import { ReviewsState } from 'ember-osf-web/models/provider';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import Media from 'ember-responsive';
import PreprintRequestModel from 'ember-osf-web/models/preprint-request';

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
    provider: PreprintProviderModel;
    latestWithdrawalRequest: PreprintRequestModel | null;
    latestAction: PreprintRequestActionModel | ReviewActionModel | null;
}

export default class PreprintStatusBanner extends Component<InputArgs>{
    @service intl!: Intl;
    @service theme!: Theme;
    @service media!: Media;

    @tracked displayComment = false;

    // translations
    labelModeratorFeedback = 'preprints.detail.status_banner.feedback.moderator_feedback';
    moderator = 'preprints.detail.status_banner.feedback.moderator';
    baseMessage = 'preprints.detail.status_banner.message.base';

    get isPendingWithdrawal(): boolean {
        return Boolean(this.args.latestWithdrawalRequest) && !this.isWithdrawalRejected;
    }

    get isWithdrawalRejected(): boolean {
        const isPreprintRequestActionModel = this.args.latestAction instanceof PreprintRequestActionModel;
        return isPreprintRequestActionModel && this.args.latestAction?.actionTrigger === 'reject';
    }

    get reviewerComment(): string | undefined {
        return this.args.latestAction?.comment;
    }

    get reviewerName(): string | undefined {
        return this.args.latestAction?.creator.get('fullName');
    }

    get isWithdrawn() {
        return this.args.submission.isWithdrawn;
    }

    public get getClassName(): string {
        if (this.isPendingWithdrawal) {
            return CLASS_NAMES[PENDING_WITHDRAWAL];
        } else if (this.isWithdrawn) {
            return CLASS_NAMES[WITHDRAWN];
        } else if (this.isWithdrawalRejected) {
            return CLASS_NAMES[WITHDRAWAL_REJECTED];
        } else {
            return this.args.submission.reviewsState === PENDING ?
                CLASS_NAMES[this.args.provider.reviewsWorkflow || UNKNOWN] :
                CLASS_NAMES[this.args.submission.reviewsState];
        }
    }

    public get bannerContent(): string {
        const { provider } = this.args;
        if (this.isPendingWithdrawal) {
            return this.intl.t(this.statusExplanation, { documentType: provider.documentType.singular });
        } else if (this.isWithdrawn) {
            return this.intl.t(MESSAGE[WITHDRAWN], { documentType: provider.documentType.singular });
        } else if (this.isWithdrawalRejected) {
            return this.intl.t(MESSAGE[WITHDRAWAL_REJECTED], { documentType: provider.documentType.singular });
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
                documentType: this.args.provider.documentType.singular,
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
            return this.args.submission.reviewsState === PENDING ?
                MESSAGE[this.args.provider.reviewsWorkflow || UNKNOWN ] :
                MESSAGE[this.args.submission.reviewsState];
        }
    }

    public get status(): string {
        let currentState = this.args.submission.reviewsState;
        if (this.isPendingWithdrawal) {
            currentState = ReviewsState.PENDING_WITHDRAWAL;
        } else if (this.isWithdrawalRejected) {
            currentState = ReviewsState.WITHDRAWAL_REJECTED;
        }
        return STATUS[currentState];
    }

    public get icon(): string {
        let currentState = this.args.submission.reviewsState;
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
        return WORKFLOW[this.args.provider.reviewsWorkflow || UNKNOWN];
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
