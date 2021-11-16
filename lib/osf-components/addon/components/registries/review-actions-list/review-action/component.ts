import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import ReviewActionModel, { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import SchemaResponseActionModel, { SchemaResponseActionTrigger } from 'ember-osf-web/models/schema-response-action';
import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';

type AllTriggerActions = SchemaResponseActionTrigger | ReviewActionTrigger;

interface Args {
    reviewAction: ReviewActionModel | SchemaResponseActionModel;
    embargoEndDate: Date;
}

export default class ReviewAction extends Component<Args> {
    @service intl!: Intl;

    get hasComment() {
        return Boolean(this.args.reviewAction.comment);
    }

    get translationString() {
        const { reviewAction } = this.args;
        const registrationContributorActions =
            [
                ReviewActionTrigger.RequestWithdrawal,
                ReviewActionTrigger.RequestEmbargoTermination,
            ] as AllTriggerActions[];
        const revisionContributorActions =
            [
                SchemaResponseActionTrigger.SubmitRevision,
                SchemaResponseActionTrigger.AdminApproveRevision,
                SchemaResponseActionTrigger.AdminRejectRevision,
            ] as AllTriggerActions[];
        const revisionModeratorActions =
            [
                SchemaResponseActionTrigger.AcceptRevision,
                SchemaResponseActionTrigger.RejectRevision,
            ] as AllTriggerActions[];
        if (reviewAction.actionTrigger === ReviewActionTrigger.AcceptSubmission) {
            if (reviewAction.toState === RegistrationReviewStates.Embargo) {
                return this.intl.t('registries.reviewAction.acceptEmbargoSubmission',
                    {
                        action: reviewAction.triggerPastTense,
                        moderator: reviewAction.creator.get('fullName'),
                        date: formattedTimeSince(reviewAction.dateModified),
                        embargoEndDate: this.intl.formatDate(this.args.embargoEndDate, { locale: this.intl.locale }),
                    });
            }
            return this.intl.t('registries.reviewAction.acceptSubmission',
                {
                    action: reviewAction.triggerPastTense,
                    moderator: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        if (registrationContributorActions.includes(reviewAction.actionTrigger)) {
            return this.intl.t('registries.reviewAction.contributorAction',
                {
                    action: reviewAction.triggerPastTense,
                    contributor: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        if (reviewAction.actionTrigger === ReviewActionTrigger.Submit) {
            if (this.args.embargoEndDate) {
                return this.intl.t('registries.reviewAction.submitActionWithEmbargo',
                    {
                        contributor: reviewAction.creator.get('fullName'),
                        date: formattedTimeSince(reviewAction.dateModified),
                        embargoEndDate: this.intl.formatDate(this.args.embargoEndDate, { locale: this.intl.locale }),
                    });
            }
            return this.intl.t('registries.reviewAction.submitActionWithoutEmbargo',
                {
                    contributor: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        if (revisionContributorActions.includes(reviewAction.actionTrigger)) {
            return this.intl.t('registries.reviewAction.revisionContributorAction',
                {
                    action: reviewAction.triggerPastTense,
                    contributor: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        if (revisionModeratorActions.includes(reviewAction.actionTrigger)) {
            return this.intl.t('registries.reviewAction.revisionModeratorAction',
                {
                    action: reviewAction.triggerPastTense,
                    moderator: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        return this.intl.t('registries.reviewAction.moderatorAction',
            {
                action: reviewAction.triggerPastTense,
                moderator: reviewAction.creator.get('fullName'),
                date: formattedTimeSince(reviewAction.dateModified),
            });
    }
}
