import { HandlerContext, Schema } from 'ember-cli-mirage';

export function createNode(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs();
    const node = schema.nodes.create(attrs);
    const now = (new Date()).toISOString();
    node.attrs.dateModified = now;
    node.attrs.dateCreated = now;
    const userId = schema.roots.first().attrs.currentUserId;
    const currentUser = schema.users.find(userId);
    schema.contributors.create({ node, users: currentUser, index: 0 });

    return node;
}
