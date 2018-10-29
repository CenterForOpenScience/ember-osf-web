import { HandlerContext, Schema } from 'ember-cli-mirage';

export function moveFile(this: HandlerContext, schema: Schema) {
    const fileId = this.request.params.id;
    const nodeId = JSON.parse(this.request.requestBody).resource;
    const file = schema.files.find(fileId);
    file.update({
        userId: null,
        nodeId,
    });
    return file;
}
