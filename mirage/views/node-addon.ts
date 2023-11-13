import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';

import NodeAddonModel from 'ember-osf-web/models/node-addon';
import { filter, process } from './utils';

export function nodeAddonDetail(this: HandlerContext, schema: Schema, request: Request) {
    const { id } = request.params;
    const nodeAddon = schema.nodeAddons.find(id);

    nodeAddon.configured = Boolean(nodeAddon.folderPath);

    const serializedNodeAddon = this.serialize(nodeAddon);
    const { data } = process(schema, request, this, [serializedNodeAddon.data]);

    return {
        data: data[0],
        meta: serializedNodeAddon.meta,
    };
}

export function nodeAddonList(this: HandlerContext, schema: Schema, request: Request) {
    const nodeAddons = schema.nodes
        .find(request.params.parentID)['nodeAddons']
        .models
        .filter((m: ModelInstance<NodeAddonModel>) => filter(m, request))
        .map((model: ModelInstance<NodeAddonModel>) => {
            model.configured = Boolean(model.folderPath);
            return model;
        })
        .map((model: ModelInstance<NodeAddonModel>) => this.serialize(model).data);

    const json = process(schema, request, this, nodeAddons, { defaultSortKey: 'last_logged' });
    return json;
}
