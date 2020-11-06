import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { ReviewActionTrigger } from 'ember-osf-web/models/review-action';

export function createReviewAction(this: HandlerContext, schema: Schema, request: Request) {
    const attrs = this.normalizedRequestAttrs('review-action');
    const registrationId = request.params.parentID;
    const userId = schema.roots.first().currentUserId;
    const now = (new Date()).toISOString();
    let reviewAction;
    if (userId && registrationId) {
        const currentUser = schema.users.find(userId);
        const registration = schema.registrations.find(registrationId);
        const { trigger } = attrs as any; // have to cast attrs to any because `actionTrigger` does not exist on type
        reviewAction = schema.reviewActions.create({
            creator: currentUser,
            target: registration,
            provider: registration.provider,
            dateCreated: now,
            dateModified: now,
            ...attrs,
        });
        switch (trigger) {
        case ReviewActionTrigger.AcceptSubmission:
        case ReviewActionTrigger.RejectWithdrawal:
            registration.reviewsState = RegistrationReviewStates.Accepted;
            break;
        case ReviewActionTrigger.RejectSubmission:
            registration.reviewsState = RegistrationReviewStates.Rejected;
            break;
        case ReviewActionTrigger.ForceWithdraw:
        case ReviewActionTrigger.AcceptWithdrawal:
            registration.reviewsState = RegistrationReviewStates.Withdrawn;
            break;
        default:
            break;
        }
    }
    return reviewAction;
}
