import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import { SubjectRef } from 'ember-osf-web/models/taxonomy';
import { process } from './utils/index';

function matchKeywordQuery(item: ModelInstance<CollectedMetadatum>, queryKeyword: string) {
    return item.guid.attrs.title.includes(queryKeyword);
}

function matchSubjectQuery(item: ModelInstance<CollectedMetadatum>, querySubjects: string[]) {
    if (querySubjects.length === 0) {
        return true;
    }
    const flatSubjects: SubjectRef[] = ([] as SubjectRef[]).concat(...item.attrs.subjects);
    if (flatSubjects.length === 0) {
        return false;
    }
    return flatSubjects.some(subject => querySubjects.includes(subject.text));
}

export function searchCollections(this: HandlerContext, schema: Schema, request: Request) {
    const { data: { attributes: { q = '', subjects = [] } } } = JSON.parse(request.requestBody);
    const collectedMetadata = schema.collectedMetadata.all().models.filter((item: ModelInstance<CollectedMetadatum>) =>
        matchKeywordQuery(item, q) && matchSubjectQuery(item, subjects));
    request.queryParams.embed = 'guid';
    const json = process(schema, request, this, collectedMetadata.map(m => this.serialize(m).data));
    return json;
}
