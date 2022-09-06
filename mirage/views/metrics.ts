import { HandlerContext, Schema, Response } from 'ember-cli-mirage';

export function postCountedUsage(this: HandlerContext, schema: Schema) {
    schema.countedUsages.create(this.normalizedRequestAttrs('counted-usage') as any);
    return new Response(201);
}
