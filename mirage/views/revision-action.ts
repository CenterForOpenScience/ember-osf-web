import { HandlerContext, NormalizedRequestAttrs, Request, Schema } from 'ember-cli-mirage';
import { RevisionReviewStates } from 'ember-osf-web/models/revision';
import RevisionActionModel, { RevisionActionTrigger } from 'ember-osf-web/models/revision-action';

export function createRevisionAction(this: HandlerContext, schema: Schema, request: Request) {
    const attrs = this.normalizedRequestAttrs('revision-action') as
        Partial<NormalizedRequestAttrs<RevisionActionModel>>;
    const revisionId = request.params.revisionId;
    const userId = schema.roots.first().currentUserId;
    let revisionAction;
    if (userId && revisionId) {
        const currentUser = schema.users.find(userId);
        const revision = schema.revisions.find(revisionId);
        const registration = revision.registration;
        const { trigger } = attrs as any; // have to cast attrs to any because `actionTrigger` does not exist on type
        revisionAction = schema.revisionActions.create({
            creator: currentUser,
            target: revision,
            dateCreated: new Date(),
            dateModified: new Date(),
            ...attrs,
        });
        switch (trigger) {
        case RevisionActionTrigger.SubmitRevision:
            revision.reviewState = RevisionReviewStates.RevisionPendingAdminApproval;
            revision.isPendingCurrentUserApproval = true;
            break;
        case RevisionActionTrigger.AdminRejectRevision:
        case RevisionActionTrigger.RejectRevision:
            revision.reviewState = RevisionReviewStates.RevisionInProgress;
            revision.isPendingCurrentUserApproval = false;
            break;
        case RevisionActionTrigger.AdminApproveRevision:
            revision.reviewState = RevisionReviewStates.RevisionPendingModeration;
            revision.isPendingCurrentUserApproval = false;
            break;
        case RevisionActionTrigger.AcceptRevision:
            revision.reviewState = RevisionReviewStates.Approved;
            break;
        default:
            break;
        }
        registration.revisionState = revision.reviewState;
        revision.save();
        registration.save();
    }
    return revisionAction;
}
