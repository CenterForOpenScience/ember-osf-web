import { HandlerContext, NormalizedRequestAttrs, Request, Schema } from 'ember-cli-mirage';
import CollectionSubmissionAction,
{ CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';
import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';

export function createSubmissionAction(this: HandlerContext, schema: Schema, request: Request) {
    const attrs = this.normalizedRequestAttrs('collection-submission-action') as
        Partial<NormalizedRequestAttrs<CollectionSubmissionAction>>;
    const submissionId = request.params.submissionID;
    const userId = schema.roots.first().currentUserId;
    let collectionSubmissionAction;
    if (userId && submissionId) {
        const currentUser = schema.users.find(userId);
        const submission = schema.collectionSubmissions.find(submissionId);
        const { trigger, comment } = attrs as any; // cast attrs to any because `actionTrigger` does not exist on type
        collectionSubmissionAction = schema.collectionSubmissionActions.create({
            creator: currentUser,
            target: submission,
            dateCreated: new Date(),
            dateModified: new Date(),
            actionTrigger: trigger,
            comment,
        });
        switch (trigger) {
        case CollectionSubmissionActionTrigger.Accept:
            submission.reviewsState = CollectionSubmissionReviewStates.Accepted;
            break;
        case CollectionSubmissionActionTrigger.ModeratorRemove:
            submission.reviewsState = CollectionSubmissionReviewStates.Removed;
            break;
        case CollectionSubmissionActionTrigger.Reject:
            submission.reviewsState = CollectionSubmissionReviewStates.Rejected;
            break;
        default:
            break;
        }
        submission.save();
    }
    return collectionSubmissionAction;
}
