import { camelize, underscore } from '@ember/string';
import { ModelInstance, Request, resourceAction, Response, Schema, Server } from 'ember-cli-mirage';
import { RelationshipsFor } from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { pluralize, singularize } from 'ember-inflector';

import { filter, process } from './utils';

interface ResourceOptions extends ActionOptions<resourceAction> {
    defaultPageSize?: number;
    path: string;
    defaultSortKey: string;
}

interface NestedResourceOptions extends ResourceOptions {
    relatedModelName: keyof ModelRegistry;
    onCreate?: (parent: ModelInstance, child: ModelInstance) => void;
}

type relationshipAction = 'self' | 'related' | 'update' | 'add' | 'remove';

interface RelationshipOptions extends ActionOptions<relationshipAction> {
    defaultPageSize?: number;
    path: string;
    defaultSortKey: string;
}

interface ActionOptions<T extends string> {
    only?: T[];
    except?: T[];
}

function gatherActions<T extends string>(opts: ActionOptions<T>, actions: T[]) {
    if (opts.only) {
        return opts.only;
    }
    if (opts.except) {
        return actions.filter(a => !opts.except!.includes(a));
    }
    return actions;
}

function gatherResourceActions(opts: ResourceOptions) {
    const actions: resourceAction[] = ['index', 'show', 'create', 'update', 'delete'];
    return gatherActions(opts, actions);
}

function gatherRelationshipActions(opts: RelationshipOptions) {
    const actions: relationshipAction[] = ['self', 'related', 'update', 'add', 'remove'];
    return gatherActions(opts, actions);
}

// For top-level resources, e.g. `/v2/nodes/`
export function osfResource(
    server: Server,
    modelName: keyof ModelRegistry,
    options?: Partial<ResourceOptions>,
) {
    const mirageModelName = pluralize(camelize(modelName));
    const opts: ResourceOptions = {
        path: `/${pluralize(underscore(modelName))}`,
        defaultSortKey: '-id',
        ...options,
    };
    const detailPath = `${opts.path}/:id`;
    const actions = gatherResourceActions(opts);

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

// For resources that are only accessible through a top-level resource's relationship,
// e.g. `/v2/nodes/<node_id>/contributors/<contributor_id>` (there is no `/v2/contributors/<contributor_id>`)
export function osfNestedResource<K extends keyof ModelRegistry>(
    server: Server,
    parentModelName: K,
    relationshipName: string & RelationshipsFor<ModelRegistry[K]>,
    options?: Partial<NestedResourceOptions>,
) {
    const opts: NestedResourceOptions = {
        path: `/${pluralize(underscore(parentModelName))}/:parentID/${underscore(relationshipName)}`,
        relatedModelName: singularize(relationshipName),
        defaultSortKey: '-id',
        ...options,
    };
    const mirageParentModelName = pluralize(camelize(parentModelName));
    const mirageRelatedModelName = pluralize(camelize(opts.relatedModelName));
    const detailPath = `${opts.path}/:id`;
    const actions = gatherResourceActions(opts);

    if (actions.includes('index')) {
        server.get(opts.path, function(schema, request) {
            const data = schema[mirageParentModelName]
                .find(request.params.parentID)[relationshipName]
                .models
                .filter((m: ModelInstance) => filter(m, request))
                .map((model: ModelInstance) => this.serialize(model).data);
            return process(schema, request, this, data, opts);
        });
    }

    if (actions.includes('show')) {
        server.get(detailPath, function(schema, request) {
            const model = this.serialize(schema[mirageRelatedModelName].find(request.params.id)).data;
            const data = process(schema, request, this, [model], opts).data[0];
            return { data };
        });
    }

    if (actions.includes('create')) {
        server.post(opts.path, function(schema, request) {
            const attrs = this.normalizedRequestAttrs(opts.relatedModelName);
            const child = schema[mirageRelatedModelName].create(attrs);
            const parent = schema[mirageParentModelName].find(request.params.parentID);
            parent[relationshipName].models.pushObject(child);
            parent.save();
            child.reload();
            if (opts.onCreate) {
                opts.onCreate(parent, child);
            }
            return child;
        });
    }

    if (actions.includes('update')) {
        server.put(detailPath, opts.relatedModelName);
        server.patch(detailPath, opts.relatedModelName);
    }

    if (actions.includes('delete')) {
        server.del(detailPath, opts.relatedModelName);
    }
}

// For to-many relationships between top-level resources,
// e.g. `/v2/nodes/<node_id>/affiliated_institutions/<id>` (but the institution lives at `/v2/institutions/<id>`)
export function osfToManyRelationship<K extends keyof ModelRegistry>(
    server: Server,
    parentModelName: K,
    relationshipName: string & RelationshipsFor<ModelRegistry[K]>,
    options?: Partial<RelationshipOptions>,
) {
    const opts: RelationshipOptions = {
        path: `/${pluralize(underscore(parentModelName))}/:parentID/relationships/${underscore(relationshipName)}`,
        relatedModelName: relationshipName,
        defaultSortKey: '-id',
        ...options,
    };
    const mirageParentModelName = pluralize(camelize(parentModelName));
    const actions = gatherRelationshipActions(opts);

    if (actions.includes('related')) {
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

    if (actions.includes('add')) {
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

    if (actions.includes('update')) {
        server.put(opts.path, (schema: Schema, request: Request) => {
            const { parentID } = request.params;
            const parentModel = schema[mirageParentModelName].find(parentID);
            const { data: relateds } = JSON.parse(request.requestBody);
            const relatedIdsKey = `${singularize(relationshipName)}Ids`;
            parentModel.update({
                [relatedIdsKey]: relateds.map((relatedModel: { id: string, type: string }) => relatedModel.id),
            });
            return { data: parentModel[relatedIdsKey].map((id: string) => ({ id, type: relateds[0].type })) };
        });
    }

    if (actions.includes('self')) {
        server.patch(opts.path, (schema: Schema, request: Request) => {
            const { parentID } = request.params;
            const parentModel = schema[mirageParentModelName].find(parentID);
            const { data: relatedRefs } = JSON.parse(request.requestBody) as {
                data: Array<Record<'id' | 'type', string>>,
            };
            const relatedIdsKey = `${singularize(relationshipName)}Ids`;

            parentModel.update({
                [relatedIdsKey]: relatedRefs.mapBy('id'),
            });

            return { data: relatedRefs };
        });
    }

    if (actions.includes('remove')) {
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
