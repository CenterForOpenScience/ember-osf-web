import { HandlerContext, Schema } from 'ember-cli-mirage';

export function rootDetail(this: HandlerContext, schema: Schema) {
    const root = schema.roots.first() || schema.roots.create({ currentUser: null });
    const json = this.serialize(root);
    if (root.currentUser && 'meta' in json) {
        json.meta.current_user = this.serialize(root.currentUser);
    }
    return json;
}
