import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import CollectionSubmission from 'ember-osf-web/models/collection-submission';
import { process } from './utils/index';

function matchKeywordQuery(item: ModelInstance<CollectionSubmission>, queryKeyword: string) {
    return item.guid.attrs.title.includes(queryKeyword);
}

export function searchCollections(this: HandlerContext, schema: Schema, request: Request) {
    const {
        data: {
            attributes: {
                q = '',
                collectedType,
                issue,
                programArea,
                status,
                volume,
                schoolType,
                studyDesign,
            },
        },
    } = JSON.parse(request.requestBody);
    let collectionSubmissions = schema.collectionSubmissions.all().models.filter(
        (item: ModelInstance<CollectionSubmission>) => matchKeywordQuery(item, q),
    );
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
    if (studyDesign) {
        collectionSubmissions = collectionSubmissions.filter(
            (item: ModelInstance<CollectionSubmission>) => studyDesign.any(
                (value: string) => item.attrs.studyDesign === value,
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
