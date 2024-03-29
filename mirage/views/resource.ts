import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

type Undef = 'undefined';

export function createResource(this: HandlerContext, schema: Schema) {
    const attrs = {
        ...this.normalizedRequestAttrs('resource'),
        finalized: false,
        resourceType: 'undefined' as Undef,
    };
    return schema.resources.create(attrs);
}

export function updateResource(this: HandlerContext, schema: Schema, request: Request) {
    const resource = schema.resources.find(request.params.id);
    const attributes = {
        ...this.normalizedRequestAttrs('resource'),
    };
    if ('pid' in attributes) {
        if (!attributes.pid || !attributes.pid.startsWith('10.')) {
            return new Response(400, {}, {
                errors: [{
                    status: '400',
                    detail: 'invalid doi',
                    source: {pointer: '/data/attributes/pid'},
                }],
            });
        }
    }
    resource.update(attributes);
    return this.serialize(resource);
}
