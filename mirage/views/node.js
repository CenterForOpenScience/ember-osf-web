import { process } from './utils';

export const nodeContributorList = function (schema, request, config) {
    const node = schema.nodes.find(request.params.id);
    const contributors = [];
    for (const contributor of node.contributors.models) {
        contributors.push(config.serialize(contributor).data);
    }
    return process(schema, request, config, contributors, {});
};

export const nodeLinkedNodeList = function (schema, request, config) {
    const node = schema.nodes.find(request.params.id);
    const linkedNodes = [];
    for (const linkedNode of node.linkedNodes.models) {
        linkedNodes.push(config.serialize(linkedNode).data);
    }
    const response = process(schema, request, config, linkedNodes, {});
    return response;
};
