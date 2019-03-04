import { HandlerContext, Schema } from 'ember-cli-mirage';

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
