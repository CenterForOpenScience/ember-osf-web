import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';

import CollectionSubmissionActionModel,
{ CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';
import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import ReviewActionModel, { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import SchemaResponseActionModel, { SchemaResponseActionTrigger } from 'ember-osf-web/models/schema-response-action';
import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';

type RegistrationTriggerActions = SchemaResponseActionTrigger | ReviewActionTrigger;

interface Args {
    reviewAction: ReviewActionModel | SchemaResponseActionModel | CollectionSubmissionActionModel;
    embargoEndDate: Date;
}

export default class ReviewAction extends Component<Args> {
    @service intl!: Intl;

    get hasComment() {
        return Boolean(this.args.reviewAction.comment);
    }

    get translationString() {
        if (this.args.reviewAction instanceof ReviewActionModel ||
            this.args.reviewAction instanceof SchemaResponseActionModel) {
            return this.registriesTranslationString;
        } else {
            return this.collectionsTranslationString;
        }
    }

    get registriesTranslationString() {
        const reviewAction = this.args.reviewAction as ReviewActionModel | SchemaResponseActionModel;
        const registrationContributorActions =
            [
                ReviewActionTrigger.RequestWithdrawal,
                ReviewActionTrigger.RequestEmbargoTermination,
            ] as RegistrationTriggerActions[];
        const revisionContributorActions =
            [
                SchemaResponseActionTrigger.SubmitRevision,
                SchemaResponseActionTrigger.AdminApproveRevision,
                SchemaResponseActionTrigger.AdminRejectRevision,
            ] as RegistrationTriggerActions[];
        const revisionModeratorActions =
            [
                SchemaResponseActionTrigger.AcceptRevision,
                SchemaResponseActionTrigger.RejectRevision,
            ] as RegistrationTriggerActions[];
        if (reviewAction.actionTrigger === ReviewActionTrigger.AcceptSubmission) {
            if (reviewAction.toState === RegistrationReviewStates.Embargo) {
                return this.intl.t('osf-components.reviewActionsList.reviewAction.acceptRegistrationEmbargoSubmission',
                    {
                        action: reviewAction.triggerPastTense,
                        moderator: reviewAction.creator.get('fullName'),
                        date: formattedTimeSince(reviewAction.dateModified),
                        embargoEndDate: this.intl.formatDate(this.args.embargoEndDate, { locale: this.intl.locale }),
                    });
            }
            return this.intl.t('osf-components.reviewActionsList.reviewAction.acceptRegistrationSubmission',
                {
                    action: reviewAction.triggerPastTense,
                    moderator: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        if (registrationContributorActions.includes(reviewAction.actionTrigger)) {
            return this.intl.t('osf-components.reviewActionsList.reviewAction.registrationContributorAction',
                {
                    action: reviewAction.triggerPastTense,
                    contributor: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        if (reviewAction.actionTrigger === ReviewActionTrigger.Submit) {
            if (this.args.embargoEndDate) {
                return this.intl.t('osf-components.reviewActionsList.reviewAction.registrationSubmitActionWithEmbargo',
                    {
                        contributor: reviewAction.creator.get('fullName'),
                        date: formattedTimeSince(reviewAction.dateModified),
                        embargoEndDate: this.intl.formatDate(this.args.embargoEndDate, { locale: this.intl.locale }),
                    });
            }
            return this.intl.t('osf-components.reviewActionsList.reviewAction.registrationSubmitActionWithoutEmbargo',
                {
                    contributor: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        if (revisionContributorActions.includes(reviewAction.actionTrigger)) {
            return this.intl.t('osf-components.reviewActionsList.reviewAction.revisionContributorAction',
                {
                    action: reviewAction.triggerPastTense,
                    contributor: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        if (revisionModeratorActions.includes(reviewAction.actionTrigger)) {
            return this.intl.t('osf-components.reviewActionsList.reviewAction.revisionModeratorAction',
                {
                    action: reviewAction.triggerPastTense,
                    moderator: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        return this.intl.t('osf-components.reviewActionsList.reviewAction.registrationModeratorAction',
            {
                action: reviewAction.triggerPastTense,
                moderator: reviewAction.creator.get('fullName'),
                date: formattedTimeSince(reviewAction.dateModified),
            });
    }

    get collectionsTranslationString() {
        const reviewAction = this.args.reviewAction as CollectionSubmissionActionModel;
        const collectionContributorActions =
            [
                CollectionSubmissionActionTrigger.Submit,
                CollectionSubmissionActionTrigger.Resubmit,
                CollectionSubmissionActionTrigger.AdminRemove,
            ];

        if (collectionContributorActions.includes(reviewAction.actionTrigger)) {
            return this.intl.t('osf-components.reviewActionsList.reviewAction.collectionContributorAction',
                {
                    action: reviewAction.triggerPastTense,
                    contributor: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        return this.intl.t('osf-components.reviewActionsList.reviewAction.collectionModeratorAction',
            {
                action: reviewAction.triggerPastTense,
                moderator: reviewAction.creator.get('fullName'),
                date: formattedTimeSince(reviewAction.dateModified),
            });
    }
}
