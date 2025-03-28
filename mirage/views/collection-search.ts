import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import CollectionSubmission, { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import { MirageCollectionProvider } from 'ember-osf-web/mirage/factories/collection-provider';
import { process } from './utils/index';

function matchKeywordQuery(item: ModelInstance<CollectionSubmission>, queryKeyword: string) {
    return item.guid.attrs.title.includes(queryKeyword);
}

export function searchCollections(this: HandlerContext, schema: Schema, request: Request) {
    const {
        data: {
            attributes: {
                q,
                collectedType,
                issue,
                programArea,
                status,
                volume,
                schoolType,
                gradeLevels,
                studyDesign,
                dataType,
                disease,
                provider,
            },
        },
    } = JSON.parse(request.requestBody);

    const collectionProvider = schema.collectionProviders.find(provider[0]) as ModelInstance<MirageCollectionProvider>;
    const collection = schema.collections.find(collectionProvider.primaryCollectionId);

    let collectionSubmissions = collection.collectionSubmissions.models;

    collectionSubmissions = collectionSubmissions.filter(
        (item: ModelInstance<CollectionSubmission>) =>
            item.attrs.reviewsState === CollectionSubmissionReviewStates.Accepted,
    );

    if (q) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => matchKeywordQuery(item, q),
        );
    }

    if (collectedType) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => collectedType.any(
                (value: string) => item.attrs.collectedType === value,
            ),
        );
    }
    if (issue) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => issue.any((value: string) => item.attrs.issue === value),
        );
    }
    if (programArea) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => programArea.any(
                (value: string) => item.attrs.programArea === value,
            ),
        );
    }
    if (status) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => status.any((value: string) => item.attrs.status === value),
        );
    }
    if (volume) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => volume.any((value: string) => item.attrs.volume === value),
        );
    }
    if (schoolType) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => schoolType.any(
                (value: string) => item.attrs.schoolType === value,
            ),
        );
    }
    if (gradeLevels) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => gradeLevels.any(
                (value: string) => item.attrs.gradeLevels === value,
            ),
        );
    }
    if (studyDesign) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => studyDesign.any(
                (value: string) => item.attrs.studyDesign === value,
            ),
        );
    }
    if (dataType) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => dataType.any(
                (value: string) => item.attrs.dataType === value,
            ),
        );
    }
    if (disease) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => disease.any(
                (value: string) => item.attrs.disease === value,
            ),
        );
    }
    if (request.queryParams.sort) {
        switch (request.queryParams.sort) {
        case 'modified':
            collectionSubmissions = collectionSubmissions.sort(
                (a, b) => (a.guid.dateModified > b.guid.dateModified ? 1 : -1),
            );
            break;
        case '-modified':
            collectionSubmissions = collectionSubmissions.sort(
                (a, b) => (a.guid.dateModified < b.guid.dateModified ? 1 : -1),
            );
            break;
        default:
        }
    }
    request.queryParams.embed = 'guid';
    const json = process(schema, request, this, collectionSubmissions.map(m => this.serialize(m).data));
    return json;
}
