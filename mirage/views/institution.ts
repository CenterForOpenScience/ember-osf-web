import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import { process } from './utils';

export function summaryMetrics(this: HandlerContext, schema: Schema, request: Request) {
    const model = this.serialize(schema.institutionSummaryMetrics.find(request.params.id)).data;
    const data = process(schema, request, this, [model]).data[0];
    return { data };
}
