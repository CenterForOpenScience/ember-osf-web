import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';

export function reportDelete(this: HandlerContext, schema: Schema, request: Request) {
    const { id, reporter_id: reporterId } = request.params;
    const comment = schema.comments.find(id);
    const report: ModelInstance = comment.reports.filter((r: ModelInstance) => r.reporter === reporterId).firstObject;
    if (report) {
        report.destroy();
    }
}
