import { HandlerContext, NormalizedRequestAttrs, Request, Schema } from 'ember-cli-mirage';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import SchemaResponseActionModel, { SchemaResponseActionTrigger } from 'ember-osf-web/models/schema-response-action';

export function createSchemaResponseAction(this: HandlerContext, schema: Schema, request: Request) {
    const attrs = this.normalizedRequestAttrs('schema-response-action') as
        Partial<NormalizedRequestAttrs<SchemaResponseActionModel>>;
    const revisionId = request.params.revisionId;
    const userId = schema.roots.first().currentUserId;
    let schemaResponseAction;
    if (userId && revisionId) {
        const currentUser = schema.users.find(userId);
        const revision = schema.schemaResponses.find(revisionId);
        const registration = revision.registration;
        const { trigger } = attrs as any; // have to cast attrs to any because `actionTrigger` does not exist on type
        schemaResponseAction = schema.schemaResponseActions.create({
            creator: currentUser,
            target: revision,
            dateCreated: new Date(),
            dateModified: new Date(),
            ...attrs,
        });
        switch (trigger) {
        case SchemaResponseActionTrigger.SubmitRevision:
            revision.reviewState = RevisionReviewStates.RevisionPendingAdminApproval;
            revision.isPendingCurrentUserApproval = true;
            break;
        case SchemaResponseActionTrigger.AdminRejectRevision:
        case SchemaResponseActionTrigger.RejectRevision:
            revision.reviewState = RevisionReviewStates.RevisionInProgress;
            revision.isPendingCurrentUserApproval = false;
            break;
        case SchemaResponseActionTrigger.AdminApproveRevision:
            revision.reviewState = RevisionReviewStates.RevisionPendingModeration;
            revision.isPendingCurrentUserApproval = false;
            break;
        case SchemaResponseActionTrigger.AcceptRevision:
            revision.reviewState = RevisionReviewStates.Approved;
            break;
        default:
            break;
        }
        registration.revisionState = revision.reviewState;
        revision.save();
        registration.save();
    }
    return schemaResponseAction;
}
