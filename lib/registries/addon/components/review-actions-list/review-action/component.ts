import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import ReviewActionModel, { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';

interface Args {
    reviewAction: ReviewActionModel;
    embargoEndDate: Date;
}

export default class ReviewAction extends Component<Args> {
    @service intl!: Intl;

    get hasComment() {
        return Boolean(this.args.reviewAction.comment);
    }

    get translationString() {
        const { reviewAction } = this.args;
        if (reviewAction.actionTrigger === ReviewActionTrigger.AcceptSubmission) {
            if (reviewAction.toState === RegistrationReviewStates.Embargo) {
                return this.intl.t('registries.reviewAction.acceptEmbargoSubmission',
                    {
                        action: reviewAction.triggerPastTense,
                        submitter: reviewAction.creator.get('fullName'),
                        date: formattedTimeSince(reviewAction.dateModified),
                        embargoEndDate: this.intl.formatDate(this.args.embargoEndDate, { locale: this.intl.locale }),
                    });
            }
            return this.intl.t('registries.reviewAction.acceptSubmission',
                {
                    action: reviewAction.triggerPastTense,
                    submitter: reviewAction.creator.get('fullName'),
                    date: formattedTimeSince(reviewAction.dateModified),
                });
        }
        if (reviewAction.actionTrigger === ReviewActionTrigger.RequestWithdrawal) {
            return this.intl.t('registries.reviewAction.contributorAction',
                {
                    action: reviewAction.triggerPastTense,
                    contributor: reviewAction.creator.get('fullName'),
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
