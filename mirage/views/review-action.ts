import { HandlerContext, ModelInstance, NormalizedRequestAttrs, Request, Schema } from 'ember-cli-mirage';
import { PreprintMirageModel } from 'ember-osf-web/mirage/factories/preprint';
import { MirageRegistration } from 'ember-osf-web/mirage/factories/registration';
import { MirageReviewAction } from 'ember-osf-web/mirage/factories/review-action';
import PreprintModel from 'ember-osf-web/models/preprint';
import { ReviewsState } from 'ember-osf-web/models/provider';
import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';

export function createReviewAction(this: HandlerContext, schema: Schema, request: Request) {
    const attrs = this.normalizedRequestAttrs('review-action') as Partial<NormalizedRequestAttrs<MirageReviewAction>>;
    const targetId = request.params.parentID;
    const userId = schema.roots.first().currentUserId;
    let reviewAction;
    if (userId && targetId) {
        const currentUser = schema.users.find(userId);
        const target = schema[attrs.targetId!.type].find(targetId) as
            ModelInstance<MirageRegistration | PreprintMirageModel>;
        const { trigger } = attrs as any; // have to cast attrs to any because `actionTrigger` does not exist on type
        reviewAction = schema.reviewActions.create({
            creator: currentUser,
            target,
            dateCreated: new Date(),
            dateModified: new Date(),
            ...attrs,
        });
        if (target instanceof PreprintModel) {
            switch (trigger) {
            case ReviewActionTrigger.Submit:
                target.reviewsState = ReviewsState.PENDING;
                break;
            case ReviewActionTrigger.RejectSubmission:
                target.reviewsState = ReviewsState.REJECTED;
                break;
            case ReviewActionTrigger.ForceWithdraw:
            case ReviewActionTrigger.AcceptWithdrawal:
                target.reviewsState = ReviewsState.WITHDRAWN;
                break;
            default:
                break;
            }
        } else if (target instanceof RegistrationModel) {
            switch (trigger) {
            case ReviewActionTrigger.AcceptSubmission:
            case ReviewActionTrigger.RejectWithdrawal:
                target.reviewsState = RegistrationReviewStates.Accepted;
                target.revisionState = RevisionReviewStates.Approved;
                break;
            case ReviewActionTrigger.RejectSubmission:
                target.reviewsState = RegistrationReviewStates.Rejected;
                break;
            case ReviewActionTrigger.ForceWithdraw:
            case ReviewActionTrigger.AcceptWithdrawal:
                target.reviewsState = RegistrationReviewStates.Withdrawn;
                break;
            default:
                break;
            }
        }
    }
    return reviewAction;
}
