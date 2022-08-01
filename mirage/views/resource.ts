import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

export function createResource(this: HandlerContext, schema: Schema) {
    const attrs = {
        ...this.normalizedRequestAttrs('resource'),
        finalized: false,
    };
    return schema.resources.create(attrs);
}

export function updateResource(this: HandlerContext, schema: Schema, request: Request) {
    const resource = schema.resources.find(request.params.id);
    const { data: { attributes } } = JSON.parse(request.requestBody);
    if ('pid' in attributes) {
        if (!attributes.pid || !attributes.pid.startsWith('https://doi.org/')) {
            return new Response(400);
        }
        resource.update({
            pid: attributes.pid,
        });
        delete attributes.pid;
    }
    if ('resource_type' in attributes) {
        resource.update({
            resourceType: attributes.resource_type,
        });
        delete attributes.resource_type;
    }
    resource.update(attributes);
    return this.serialize(resource);
}
