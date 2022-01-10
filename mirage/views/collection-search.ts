import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import { process } from './utils/index';

function matchKeywordQuery(item: ModelInstance<CollectedMetadatum>, queryKeyword: string) {
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
    let collectedMetadata = schema.collectedMetadata.all().models.filter(
        (item: ModelInstance<CollectedMetadatum>) => matchKeywordQuery(item, q),
    );
    if (collectedType) {
        collectedMetadata = collectedMetadata.filter(
            (item: ModelInstance<CollectedMetadatum>) => collectedType.any(
                (value: string) => item.attrs.collectedType === value,
            ),
        );
    }
    if (issue) {
        collectedMetadata = collectedMetadata.filter(
            (item: ModelInstance<CollectedMetadatum>) => issue.any((value: string) => item.attrs.issue === value),
        );
    }
    if (programArea) {
        collectedMetadata = collectedMetadata.filter(
            (item: ModelInstance<CollectedMetadatum>) => programArea.any(
                (value: string) => item.attrs.programArea === value,
            ),
        );
    }
    if (status) {
        collectedMetadata = collectedMetadata.filter(
            (item: ModelInstance<CollectedMetadatum>) => status.any((value: string) => item.attrs.status === value),
        );
    }
    if (volume) {
        collectedMetadata = collectedMetadata.filter(
            (item: ModelInstance<CollectedMetadatum>) => volume.any((value: string) => item.attrs.volume === value),
        );
    }
    if (schoolType) {
        collectedMetadata = collectedMetadata.filter(
            (item: ModelInstance<CollectedMetadatum>) => schoolType.any(
                (value: string) => item.attrs.schoolType === value,
            ),
        );
    }
    if (studyDesign) {
        collectedMetadata = collectedMetadata.filter(
            (item: ModelInstance<CollectedMetadatum>) => studyDesign.any(
                (value: string) => item.attrs.studyDesign === value,
            ),
        );
    }
    if (request.queryParams.sort) {
        switch (request.queryParams.sort) {
        case 'modified':
            collectedMetadata = collectedMetadata.sort((a, b) => (a.guid.dateModified > b.guid.dateModified ? 1 : -1));
            break;
        case '-modified':
            collectedMetadata = collectedMetadata.sort((a, b) => (a.guid.dateModified < b.guid.dateModified ? 1 : -1));
            break;
        default:
        }
    }
    request.queryParams.embed = 'guid';
    const json = process(schema, request, this, collectedMetadata.map(m => this.serialize(m).data));
    return json;
}
