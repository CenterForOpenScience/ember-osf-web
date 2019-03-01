import { HandlerContext, Request, Schema } from 'ember-cli-mirage';

export function deleteUserAddon(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const addon = schema.addons.findBy({ id });

    if (addon) {
        addon.destroy();
    }
}
