import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import { process } from './utils/index';

export function searchCollections(this: HandlerContext, schema: Schema, request: Request) {
    const nodes = schema.collectedMetadata.all().models;
    const json = process(schema, request, this, nodes.map(m => this.serialize(m).data));
    return json;
}
