import { camelize } from '@ember/string';
import { faker, HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';

export function commentDetail(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const { data: { attributes: attrs } } = JSON.parse(request.requestBody);
    const comment = schema.comments.find(id);
    const now = (new Date()).toISOString();

    comment.update({
        ...attrs,
        modified: true,
        dateModified: now,
    });

    return comment;
}

export function reportDelete(this: HandlerContext, schema: Schema, request: Request) {
    const { id, user_id: userId } = request.params;
    const comment = schema.comments.find(id);
    const report: ModelInstance = comment.reports.filter((r: ModelInstance) => r.reporter === userId).firstObject;
    if (report) {
        report.destroy();
    }
}

export function reportCreate(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs();
    const report = schema.commentReports.create(attrs);

    return report;
}

export function commentCreate(this: HandlerContext, schema: Schema, request: Request) {
    const { data: { attributes, relationships } } = JSON.parse(request.requestBody);
    const attrs = Object.keys(attributes).reduce((sum: { [ index: string ]: string, attr: string }, key: string) => {
        if (key === 'target_id') {
            sum.targetID = attributes[key]; // eslint-disable-line no-param-reassign
        } else {
            sum[camelize(key)] = attributes[key]; // eslint-disable-line no-param-reassign
        }
        return sum;
    }, {});

    const now = (new Date()).toISOString();
    const { user: { data: { id: userId } }, node: { data: nodeData } } = relationships;
    const comment = schema.comments.create({
        ...attrs,
        userId,
        id: faker.random.uuid(),
        nodeId: nodeData, // both id and type are required for polymorphic relationships fks.
        dateModified: now,
        dateCreated: now,
        deleted: false,
    });
    return comment;
}
