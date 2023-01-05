import { HandlerContext, ModelInstance, NormalizedRequestAttrs, Schema } from 'ember-cli-mirage';
import Collection from 'ember-osf-web/models/collection';
import CollectionSubmissionAction,
{ CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';
import CollectionSubmission,
{ CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';

export function createSubmissionAction(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('collection-submission-action') as
        Partial<NormalizedRequestAttrs<CollectionSubmissionAction>>;
    const userId = schema.roots.first().currentUserId;
    let collectionSubmissionAction;
    if (userId) {
        const currentUser = schema.users.find(userId);
        // cast attrs to any because `actionTrigger` does not exist on type
        const { trigger, comment, targetId } = attrs as any;
        const [nodeId, collectionId] = targetId.split('-');
        const collection = schema.collections.find(collectionId) as ModelInstance<Collection>;
        const submission = collection.collectionSubmissions.models
            .find(sub => sub.id === nodeId) as ModelInstance<CollectionSubmission>;
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
        case CollectionSubmissionActionTrigger.Remove:
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
