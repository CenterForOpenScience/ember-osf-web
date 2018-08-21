import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import { process } from './utils';

export function nodeContributorList(schema: Schema, request: Request, handlerContext: HandlerContext) {
    const node = schema.nodes.find(request.params.id);
    const contributors = node.contributors.models.map((contributor: any) => handlerContext.serialize(contributor).data);
    return process(schema, request, handlerContext, contributors, {});
}

export function nodeLinkedNodeList(schema: Schema, request: Request, handlerContext: HandlerContext) {
    const node = schema.nodes.find(request.params.id);
    const linkedNodes = node.linkedNodes.models.map((linkedNode: any) => handlerContext.serialize(linkedNode).data);
    const response = process(schema, request, handlerContext, linkedNodes, {});
    return response;
}
