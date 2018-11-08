import { camelize, underscore } from '@ember/string';
import { resourceAction, Server } from 'ember-cli-mirage';
import { ModelRegistry, RelationshipsFor } from 'ember-data';
import { pluralize } from 'ember-inflector';

import { filter, process } from './utils';

interface ResourceOptions {
    only?: resourceAction[];
    except?: resourceAction[];
    path: string;
    defaultSortKey: string;
}

interface NestedResourceOptions extends ResourceOptions {
    relatedModelName: keyof ModelRegistry;
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
    modelName: keyof ModelRegistry,
    options?: Partial<ResourceOptions>,
) {
    const mirageModelName = pluralize(camelize(modelName));
    const opts: ResourceOptions = Object.assign({
        path: `/${pluralize(underscore(modelName))}`,
        defaultSortKey: '-id',
    }, options);
    const detailPath = `${opts.path}/:id`;
    const actions = gatherActions(opts);

    if (actions.includes('index')) {
        server.get(opts.path, function(schema, request) {
            const models = schema[mirageModelName]
                .where(m => filter(m, request))
                .models
                .map((m: any) => this.serialize(m).data);

            return process(schema, request, this, models, { defaultSortKey: opts.defaultSortKey });
        });
    }

    if (actions.includes('show')) {
        server.get(detailPath, function(schema, request) {
            const model = this.serialize(schema[mirageModelName].find(request.params.id)).data;
            const data = process(schema, request, this, [model], { defaultSortKey: opts.defaultSortKey }).data[0];

            return { data };
        });
    }

    if (actions.includes('create')) {
        server.post(opts.path, mirageModelName);
    }

    if (actions.includes('update')) {
        server.patch(detailPath, mirageModelName);
        server.put(detailPath, mirageModelName);
    }

    if (actions.includes('delete')) {
        server.del(detailPath, mirageModelName);
    }
}

export function osfNestedResource<K extends keyof ModelRegistry>(
    server: Server,
    parentModelName: K,
    relationshipName: string & RelationshipsFor<ModelRegistry[K]>,
    options?: Partial<NestedResourceOptions>,
) {
    const opts: NestedResourceOptions = Object.assign({
        allow: ['list'],
        path: `/${pluralize(underscore(parentModelName))}/:parentID/${underscore(relationshipName)}`,
        relatedModelName: relationshipName,
        defaultSortKey: '-id',
    }, options);
    const mirageParentModelName = pluralize(camelize(parentModelName));
    const mirageRelatedModelName = pluralize(camelize(opts.relatedModelName));
    const detailPath = `${opts.path}/:id`;
    const actions = gatherActions(opts);

    if (actions.includes('index')) {
        server.get(opts.path, function(schema, request) {
            const data = schema[mirageParentModelName].find(request.params.parentID)[relationshipName].models.map(
                (model: any) => this.serialize(model).data,
            );
            return process(schema, request, this, data, { defaultSortKey: opts.defaultSortKey });
        });
    }

    if (actions.includes('show')) {
        server.get(detailPath, mirageRelatedModelName);
    }

    if (actions.includes('create')) {
        server.post(opts.path, mirageRelatedModelName);
    }

    if (actions.includes('update')) {
        server.put(opts.path, mirageRelatedModelName);
        server.patch(opts.path, mirageRelatedModelName);
    }

    if (actions.includes('delete')) {
        server.del(opts.path, mirageRelatedModelName);
    }
}
