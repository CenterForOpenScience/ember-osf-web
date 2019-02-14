import { HandlerContext, Request, Schema } from 'ember-cli-mirage';

import { filter, process } from './utils';

export function userNodeList(this: HandlerContext, schema: Schema, request: Request) {
    const user = schema.users.find(request.params.id);
    const nodes = [];
    const { contributorIds } = user;
    for (const contributorId of contributorIds as string[]) {
        const { node } = schema.contributors.find(contributorId);
        if (filter(node, request) && node.modelName === 'node') {
            nodes.push(this.serialize(node).data);
        }
    }
    const json = process(schema, request, this, nodes, { defaultSortKey: 'last_logged' });
    return json;
}
