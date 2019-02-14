import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

import { queryParamIsTruthy } from './utils';

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
        return schema[guid.referentType!].find(id);
    }

    return guid;
}
