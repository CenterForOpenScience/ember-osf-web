import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import { filter, process } from './utils';

export function userNodeList(schema: Schema, request: Request, handlerContext: HandlerContext) {
    const user = schema.users.find(request.params.id);
    const nodes = [];
    const { contributorIds } = user;
    for (const contributorId of contributorIds as string[]) {
        const { node } = schema.contributors.find(contributorId);
        if (filter(node, request)) {
            nodes.push(handlerContext.serialize(node).data);
        }
    }
    const json = process(schema, request, handlerContext, nodes, { defaultSortKey: 'last_logged' });
    return json;
}

export function userList(schema: Schema, request: Request) {
    return schema.users.where(user => filter(user, request));
}
