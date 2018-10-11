import { HandlerContext, Request, Schema } from 'ember-cli-mirage';

import { queryParamIsTruthy } from './utils';

export function guidDetail(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const { resolve } = request.queryParams;
    const guid = schema.guids.find(id);
    if (queryParamIsTruthy(resolve)) {
        return schema[guid.referentType].find(id);
    }
    return guid;
}
