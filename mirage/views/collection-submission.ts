import { HandlerContext, Schema } from 'ember-cli-mirage';

import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import { CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';

export function createCollectionSubmission(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('collection-submission');
    const {
        collectedType,
        issue,
        programArea,
        status,
        volume,
        schoolType,
        studyDesign,
    } = attrs;
    const userId = schema.roots.first().currentUserId;
    const currentUser = schema.users.find(userId!);

    const guidModel = schema.nodes.find(attrs.guid);
    delete attrs.guid;
    const collectionModel = schema.collections.find(attrs.collectionId);

    const collectionSubmission = schema.collectionSubmissions.create({
        collection: collectionModel,
        creator: currentUser,
        guid: guidModel,
        reviewsState: CollectionSubmissionReviewStates.Pending,
        collectedType,
        issue,
        programArea,
        status,
        volume,
        schoolType,
        studyDesign,
    });

    schema.collectionSubmissionActions.create({
        actionTrigger: CollectionSubmissionActionTrigger.Submit,
        target: collectionSubmission,
        fromState: CollectionSubmissionReviewStates.InProgress,
        toState: CollectionSubmissionReviewStates.Pending,
        dateCreated: new Date(),
        dateModified: new Date(),
        creator: currentUser,
    });
    return collectionSubmission;
}
