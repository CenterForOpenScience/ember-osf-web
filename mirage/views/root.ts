import { HandlerContext, Schema } from 'ember-cli-mirage';

export function rootDetail(schema: Schema, handlerContext: HandlerContext) {
    const root = schema.roots.first();
    const json = handlerContext.serialize(root);
    if (root.currentUser && 'meta' in json) {
        json.meta.current_user = handlerContext.serialize(root.currentUser);
    }
    return json;
}
