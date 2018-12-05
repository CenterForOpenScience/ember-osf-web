import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';

export function commentUpdate(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const { data: { attributes: attrs } } = JSON.parse(request.requestBody);
    const comment = schema.comments.find(id);
    const now = (new Date()).toISOString();

    comment.update({
        ...attrs,
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
