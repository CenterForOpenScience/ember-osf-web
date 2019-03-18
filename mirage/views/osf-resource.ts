import { camelize, underscore } from '@ember/string';
import { HandlerFunction, ModelInstance, Request, resourceAction, Response, Schema, Server } from 'ember-cli-mirage';
import { RelationshipsFor } from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { pluralize, singularize } from 'ember-inflector';

import { filter, process } from './utils';

interface ResourceOptions {
    only?: resourceAction[];
    except?: resourceAction[];
    defaultPageSize?: number;
    path: string;
    defaultSortKey: string;
}

interface NestedResourceOptions extends ResourceOptions {
    relatedModelName: keyof ModelRegistry;
    views: ViewObject;
}

interface ViewObject {
    index?: HandlerFunction;
    show?: HandlerFunction;
    create?: HandlerFunction;
    update?: HandlerFunction;
    delete?: HandlerFunction;
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
                .map(m => this.serialize(m).data);

            return process(schema, request, this, models, options);
        });
    }

    if (actions.includes('show')) {
        server.get(detailPath, function(schema, request) {
            const model = this.serialize(schema[mirageModelName].find(request.params.id)).data;
            const data = process(schema, request, this, [model], options).data[0];

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
        path: `/${pluralize(underscore(parentModelName))}/:parentID/${underscore(relationshipName)}`,
        relatedModelName: relationshipName,
        defaultSortKey: '-id',
        views: {},
    }, options);
    const mirageParentModelName = pluralize(camelize(parentModelName));
    const mirageRelatedModelName = pluralize(camelize(opts.relatedModelName));
    const detailPath = `${opts.path}/:id`;
    const actions = gatherActions(opts);

    if (actions.includes('index')) {
        server.get(opts.path, function(schema, request) {
            const data = schema[mirageParentModelName]
                .find(request.params.parentID)[relationshipName]
                .models
                .filter((m: ModelInstance) => filter(m, request))
                .map((model: ModelInstance) => this.serialize(model).data);
            return process(schema, request, this, data, { defaultSortKey: opts.defaultSortKey });
        });
    }

    if (actions.includes('show')) {
        if (opts.views.show) {
            server.get(detailPath, opts.views.show);
        } else {
            server.get(detailPath, mirageRelatedModelName);
        }
    }

    if (actions.includes('create')) {
        if (opts.views.create) {
            server.post(opts.path, opts.views.create);
        } else {
            server.post(opts.path, mirageRelatedModelName);
        }
    }

    if (actions.includes('update')) {
        if (opts.views.update) {
            server.put(detailPath, opts.views.update);
            server.patch(detailPath, opts.views.update);
        } else {
            server.put(detailPath, opts.relatedModelName);
            server.patch(detailPath, opts.relatedModelName);
        }
    }

    if (actions.includes('delete')) {
        if (opts.views.delete) {
            server.del(detailPath, opts.views.delete);
        } else {
            server.del(detailPath, opts.relatedModelName);
        }
    }
}

export function osfToManyRelationship<K extends keyof ModelRegistry>(
    server: Server,
    parentModelName: K,
    relationshipName: string & RelationshipsFor<ModelRegistry[K]>,
    options?: Partial<NestedResourceOptions>,
) {
    const opts: NestedResourceOptions = Object.assign({
        path: `/${pluralize(underscore(parentModelName))}/:parentID/relationships/${underscore(relationshipName)}`,
        relatedModelName: relationshipName,
        defaultSortKey: '-id',
        views: {},
    }, options);
    const mirageParentModelName = pluralize(camelize(parentModelName));
    const actions = gatherActions(opts);

    if (actions.includes('index')) {
        const relationshipRelatedPath = opts.path.replace('relationships/', '');
        server.get(relationshipRelatedPath, function(schema, request) {
            const data = schema[mirageParentModelName]
                .find(request.params.parentID)[relationshipName]
                .models
                .filter((m: ModelInstance) => filter(m, request))
                .map((model: ModelInstance) => this.serialize(model).data);
            return process(schema, request, this, data, { defaultSortKey: opts.defaultSortKey });
        });
    }

    if (actions.includes('create')) {
        if (opts.views.create) {
            server.post(opts.path, opts.views.create);
        } else {
            server.post(opts.path, (schema: Schema, request: Request) => {
                const { parentID } = request.params;
                const parentModel = schema[mirageParentModelName].find(parentID);
                const { data: [{ id: relatedModelId, type }] } = JSON.parse(request.requestBody);
                const relatedIdsKey = `${singularize(relationshipName)}Ids`;
                if (parentModel[relatedIdsKey].includes(relatedModelId)) {
                    return new Response(409, {}, {
                        errors: [{ detail: 'Conflict.' }],
                    });
                }
                parentModel.update({
                    [relatedIdsKey]: [...parentModel[relatedIdsKey], relatedModelId],
                });
                return { data: parentModel[relatedIdsKey].map((id: string) => ({ id, type })) };
            });
        }
    }

    if (actions.includes('delete')) {
        if (opts.views.delete) {
            server.del(opts.path, opts.views.delete);
        } else {
            server.del(opts.path, (schema: Schema, request: Request) => {
                const { parentID } = request.params;
                const parentModel = schema[mirageParentModelName].find(parentID);
                const { data: [{ id: relatedModelId, type }] } = JSON.parse(request.requestBody);
                const relatedIdsKey = `${singularize(relationshipName)}Ids`;
                const relatedIds: Array<number|string> = parentModel[relatedIdsKey];
                relatedIds.splice(relatedIds.indexOf(relatedModelId), 1);
                parentModel.update({
                    [relatedIdsKey]: relatedIds,
                });
                return { data: relatedIds.map(id => ({ id, type })) };
            });
        }
    }
}
