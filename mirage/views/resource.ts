import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

export function updateResource(this: HandlerContext, schema: Schema, request: Request) {
    const resource = schema.resources.find(request.params.id);
    const { data: { attributes } } = JSON.parse(request.requestBody);
    if (!attributes.pid || !attributes.pid.startsWith('https://doi.org/')) {
        return new Response(400);
    }
    resource.update(attributes);
    return this.serialize(resource);
}
