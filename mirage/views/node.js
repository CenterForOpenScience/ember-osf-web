import { process } from './utils';

export const nodeContributorList = function (schema, request, config) {
    const node = schema.nodes.find(request.params.id);
    const contributors = node.contributors.models.map(contributor => config.serialize(contributor).data);
    return process(schema, request, config, contributors, {});
};

export const nodeLinkedNodeList = function (schema, request, config) {
    const node = schema.nodes.find(request.params.id);
    const linkedNodes = node.linkedNodes.models.map(linkedNode => config.serialize(linkedNode).data);
    const response = process(schema, request, config, linkedNodes, {});
    return response;
};
