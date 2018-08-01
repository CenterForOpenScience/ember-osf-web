import { filter, process } from './utils';

export const userNodeList = function (schema, request, config) {
    const user = schema.users.find(request.params.id);
    const nodes = [];
    const { contributorIds } = user;
    for (const contributorId of contributorIds) {
        const { node } = schema.contributors.find(contributorId);
        if (filter(node, request)) {
            nodes.push(config.serialize(node).data);
        }
    }
    const json = process(schema, request, config, nodes, { defaultSortKey: 'last_logged' });
    return json;
};

export const userList = function (schema, request) {
    return schema.users.where(function(user) { return filter(user, request); });
};
