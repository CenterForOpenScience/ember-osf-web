import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

export function createResource(this: HandlerContext, schema: Schema) {
    const attrs = {
        ...this.normalizedRequestAttrs('resource'),
        finalized: false,
        resourceType: undefined,
    };
    return schema.resources.create(attrs);
}

export function updateResource(this: HandlerContext, schema: Schema, request: Request) {
    const resource = schema.resources.find(request.params.id);
    const attributes = {
        ...this.normalizedRequestAttrs('resource'),
    };
    if ('pid' in attributes) {
        if (!attributes.pid || !attributes.pid.startsWith('https://doi.org/')) {
            return new Response(400);
        }
    }
    resource.update(attributes);
    return this.serialize(resource);
}
