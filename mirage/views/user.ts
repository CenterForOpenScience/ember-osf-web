import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

import { filter, process } from './utils';

export function userNodeList(this: HandlerContext, schema: Schema, request: Request) {
    const user = schema.users.find(request.params.id);
    const nodes = [];
    const { contributorIds } = user;
    for (const contributorId of contributorIds as string[]) {
        const { node } = schema.contributors.find(contributorId);
        if (node?.modelName === 'node' && filter(node, request)) {
            nodes.push(this.serialize(node).data);
        }
    }
    const json = process(schema, request, this, nodes, { defaultSortKey: 'last_logged' });
    return json;
}

export function userRegistrationList(this: HandlerContext, schema: Schema, request: Request) {
    const user = schema.users.find(request.params.id);
    const nodes = [];
    const { contributorIds } = user;
    for (const contributorId of contributorIds as string[]) {
        const { node } = schema.contributors.find(contributorId);
        if (node?.modelName === 'registration' && filter(node, request)) {
            nodes.push(this.serialize(node).data);
        }
    }
    const json = process(schema, request, this, nodes, { defaultSortKey: 'last_logged' });
    return json;
}

export function userPreprintList(this: HandlerContext, schema: Schema, request: Request) {
    const user = schema.users.find(request.params.id);
    const preprints = [];
    const { contributorIds } = user;

    for (const contributorId of contributorIds as string[]) {
        const contributor = schema.contributors.find(contributorId);
        const preprint = contributor.preprint;
        if (preprint && filter(preprint, request)) {
            preprints.push(this.serialize(preprint).data);
        }
    }

    const json = process(schema, request, this, preprints, { defaultSortKey: 'last_logged' });
    return json;
}

export function claimUnregisteredUser(this: HandlerContext) {
    return new Response(204);
}
