import { HandlerContext, ModelInstance, Schema } from 'ember-cli-mirage';

import Node from 'ember-osf-web/models/node';

export function createFork(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs('node');
    const nodeId = attrs.id;
    delete attrs.id;
    const node = schema.nodes.find(nodeId) as ModelInstance<Node>;
    const fork = schema.nodes.create({
        forkedFrom: node,
        category: node.category,
        fork: true,
        title: `Fork of ${node.title}`,
        description: node.description,
        ...attrs,
    });

    const userId = schema.roots.first().currentUserId;
    const currentUser = schema.users.find(userId);
    node.contributors.models.forEach((contributor: any) => {
        schema.contributors.create({ node: fork, users: contributor.users });
    });

    schema.contributors.create({ node: fork, users: currentUser, index: 0 });

    return fork;
}
