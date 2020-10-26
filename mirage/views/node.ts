import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import { process } from './utils';

export function createNode(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('node');
    const now = (new Date()).toISOString();
    const node = schema.nodes.create({
        ...attrs,
        dateModified: now,
        dateCreated: now,
    });

    const userId = schema.roots.first().currentUserId;

    if (userId) {
        const currentUser = schema.users.find(userId);
        schema.contributors.create({ node, users: currentUser, index: 0 });
    }

    return node;
}

export function storageStatus(this: HandlerContext, schema: Schema, request: Request) {
    const model = this.serialize(schema.storage.find(request.params.id)).data;
    const data = process(schema, request, this, [model]).data[0];
    return { data };
}
