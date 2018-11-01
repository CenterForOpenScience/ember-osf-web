import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

function queryParamIsTruthy(value?: string) {
    return Boolean(
        value && ['true', '1'].includes(value.toString().toLowerCase()),
    );
}

export function guidDetail(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const { resolve } = request.queryParams;
    const guid = schema.guids.find(id);

    if (!guid) {
        return new Response(404, {}, {
            meta: { version: '2.9' },
            errors: [{ detail: 'Not found.' }],
        });
    }

    if (queryParamIsTruthy(resolve)) {
        return schema[guid.referentType].find(id);
    }

    return guid;
}
