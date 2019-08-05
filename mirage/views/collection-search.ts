import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import { process } from './utils/index';

function matchKeywordQuery(item: ModelInstance<CollectedMetadatum>, queryKeyword: string) {
    return item.guid.attrs.title.includes(queryKeyword);
}

export function searchCollections(this: HandlerContext, schema: Schema, request: Request) {
    const { data: { attributes: { q = '' } } } = JSON.parse(request.requestBody);
    const collectedMetadata = schema.collectedMetadata.all().models.filter((item: ModelInstance<CollectedMetadatum>) =>
        matchKeywordQuery(item, q));
    request.queryParams.embed = 'guid';
    const json = process(schema, request, this, collectedMetadata.map(m => this.serialize(m).data));
    return json;
}
