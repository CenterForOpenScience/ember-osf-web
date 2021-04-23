import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';

export function reportDelete(this: HandlerContext, schema: Schema, request: Request) {
    const { id, reporter_id: reporterId } = request.params;
    const comment = schema.comments.find(id);
    const reports = comment.reports.filter((r: ModelInstance) => r.reporter === reporterId).models;

    comment.update({
        isAbuse: false,
    });

    if (reports) {
        reports.forEach(report => {
            report.destroy();
        });
    }
}
