import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import { process } from './utils';

export function tokenList(schema: Schema, request: Request, handlerContext: HandlerContext) {
    const tokens = schema.tokens.all().models.map((token: any) => handlerContext.serialize(token).data);
    return process(schema, request, handlerContext, tokens, {
        defaultSortKey: 'id',
    });
}
