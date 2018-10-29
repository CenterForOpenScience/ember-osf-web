import { HandlerContext, Schema } from 'ember-cli-mirage';

export function moveFile(this: HandlerContext, schema: Schema) {
    const fileId = this.request.params.id;
    const nodeId = this.request.requestBody.resource;
    const file = schema.files.find(fileId);
    file.attrs.userId = null;
    file.attrs.nodeId = nodeId;
}
