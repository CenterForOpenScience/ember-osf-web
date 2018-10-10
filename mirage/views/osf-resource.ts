import { underscore } from '@ember/string';
import { resourceAction, Server } from 'ember-cli-mirage';

import { filter, process } from './utils';

interface ResourceOptions {
    only?: resourceAction[];
    except?: resourceAction[];
    path: string;
    defaultSortKey: string;
}

interface NestedResourceOptions extends ResourceOptions {
    relatedModelName: string;
}

function gatherActions(opts: ResourceOptions) {
    let actions: resourceAction[] = ['index', 'show', 'create', 'update', 'delete'];
    if (opts.only) {
        actions = opts.only;
    }
    if (opts.except) {
        actions = actions.filter(a => !opts.except!.includes(a));
    }
    return actions;
}

export function osfResource(
    server: Server,
    modelName: string,
    options?: Partial<ResourceOptions>,
) {
    const opts: ResourceOptions = Object.assign({
        path: `/${underscore(modelName)}`,
        defaultSortKey: '-id',
    }, options);
    const detailPath = `${opts.path}/:id`;
    const actions = gatherActions(opts);

    if (actions.includes('index')) {
        server.get(opts.path, function(schema, request) {
            const models = schema[modelName]
                .where(m => filter(m, request))
                .models
                .map((m: any) => this.serialize(m).data);

            return process(schema, request, this, models, { defaultSortKey: opts.defaultSortKey });
        });
    }

    if (actions.includes('show')) {
        server.get(detailPath, modelName);
    }

    if (actions.includes('create')) {
        server.post(opts.path, modelName);
    }

    if (actions.includes('update')) {
        server.patch(detailPath, modelName);
        server.put(detailPath, modelName);
    }

    if (actions.includes('delete')) {
        server.del(detailPath, modelName);
    }
}

export function osfNestedResource(
    server: Server,
    parentModelName: string,
    relationshipName: string,
    options?: Partial<NestedResourceOptions>,
) {
    const opts: NestedResourceOptions = Object.assign({
        allow: ['list'],
        path: `/${underscore(parentModelName)}/:parentID/${underscore(relationshipName)}`,
        relatedModelName: relationshipName,
        defaultSortKey: '-id',
    }, options);
    const detailPath = `${opts.path}/:id`;
    const actions = gatherActions(opts);

    if (actions.includes('index')) {
        server.get(opts.path, function(schema, request) {
            const data = schema[parentModelName].find(request.params.parentID)[relationshipName].models.map(
                (model: any) => this.serialize(model).data,
            );
            return process(schema, request, this, data, { defaultSortKey: opts.defaultSortKey });
        });
    }

    if (actions.includes('show')) {
        server.get(detailPath, opts.relatedModelName);
    }

    if (actions.includes('create')) {
        server.post(opts.path, opts.relatedModelName);
    }

    if (actions.includes('update')) {
        server.put(opts.path, opts.relatedModelName);
        server.patch(opts.path, opts.relatedModelName);
    }

    if (actions.includes('delete')) {
        server.del(opts.path, opts.relatedModelName);
    }
}
