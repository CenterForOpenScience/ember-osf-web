import { Request, Schema } from 'ember-cli-mirage';
import { paginate } from './private/utils';

export function tokenList(schema: Schema, request: Request) {
    return paginate(request, schema.tokens.all().models);
}
