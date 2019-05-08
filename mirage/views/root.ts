import { HandlerContext, Schema } from 'ember-cli-mirage';
import { defaultRootAttrs } from 'ember-osf-web/mirage/factories/root';

export function rootDetail(this: HandlerContext, schema: Schema) {
    const root = schema.roots.first() || schema.roots.create(defaultRootAttrs);
    const json = this.serialize(root);
    if (root.currentUser && 'meta' in json) {
        json.meta.current_user = this.serialize(root.currentUser);
        if (root._withAnonymizedVOL) {
            json.meta.current_user.meta = {
                ...(json.meta.current_user.meta || {}),
                anonymous: true,
            };
        }
    }
    return json;
}
