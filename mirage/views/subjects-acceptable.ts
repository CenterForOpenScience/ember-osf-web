import { HandlerContext, Schema } from 'ember-cli-mirage';

export function getSubjectsAcceptable(this: HandlerContext, schema: Schema) {
    return schema.subjects.all();
}
