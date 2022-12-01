import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import { CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';
import { process } from './utils';

export function getCollectionSubmissions(this: HandlerContext, schema: Schema, request: Request) {
    const { parentID: collectionId } = request.params;
    const reviewsStateQps = request.queryParams['filter[reviews_state]'] ||
        CollectionSubmissionReviewStates.Accepted;
    const reviewsStateFilter = reviewsStateQps.split(',');
    const idFilter = request.queryParams['filter[id]'].split(',');
    const collection = schema.collections.find(collectionId);

    if (!collection) {
        return new Response(404, {}, {
            errors: [{
                detail: 'Collection not found.',
            }],
        });
    }
    let collectionSubmissions = collection.collectionSubmissions.models.filter(
        (submission => submission.reviewsState && reviewsStateFilter.includes(submission.reviewsState)),
    );
    if (idFilter) {
        collectionSubmissions = collectionSubmissions.filter(
            (submission => submission.id && idFilter.includes(submission.id)),
        );
    }
    return process(
        schema,
        request,
        this,
        collectionSubmissions.map(submission => this.serialize(submission).data),
    );
}

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
    const collectionModel = schema.collections.find(attrs.collectionId);
    schema.collectionSubmissions.create({
        id: `${collectionModel.id}-${attrs.guid}`,
        collectedType,
        issue,
        programArea,
        status,
        volume,
        schoolType,
        studyDesign,
        guid: guidModel,
        collection: collectionModel,
        creator: currentUser,
    });

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
