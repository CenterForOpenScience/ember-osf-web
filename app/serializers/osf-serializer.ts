import Model from '@ember-data/model';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import Store from '@ember-data/store';
import { camelize, underscore } from '@ember/string';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { AttributesObject, DocWithErrors } from 'jsonapi-typescript';

// This import will change with 4.12 of ember-data. It will instead be
// import { peekGraph } from '@ember-data/graph/-private';
import { peekGraph } from '@ember-data/record-data/-private';
import { recordIdentifierFor } from '@ember-data/store';

import {
    PaginatedMeta,
    Resource,
    ResourceCollectionDocument,
    SingleResourceDocument,
} from 'osf-api';

import OsfModel, { OsfLinks } from 'ember-osf-web/models/osf-model';

const API_TYPE_KEYS: Record<string, string & keyof ModelRegistry> = {
    applications: 'developer-app',
};

interface NormalizedPaginatedMeta extends PaginatedMeta {
    total_pages: number; // eslint-disable-line camelcase
}

interface NormalizedResourceCollectionDocument extends ResourceCollectionDocument {
    meta: NormalizedPaginatedMeta;
}

interface OsfSerializerOptions {
    includeCleanData?: boolean;
}

export default class OsfSerializer extends JSONAPISerializer {
    attrs = {
        links: {
            serialize: false,
        },
        relatedCounts: {
            serialize: false,
        },
    };

    /**
     * Get embedded objects from the response and push them into the store.
     * Return a new resource hash that only contains relationships in JSON API format,
     * or the original resource hash, unchanged.
     */
    _extractEmbeds(resourceHash: Resource): Partial<Resource> {
        if (!resourceHash.embeds || !resourceHash.relationships) {
            return resourceHash;
        }
        const relationships: { [k: string]: any } = {};
        for (const relName of Object.keys(resourceHash.relationships)) {
            const embeddedObj = resourceHash.embeds[relName];

            if (!embeddedObj) {
                // Non-embedded relationship; let it pass through unchanged
                relationships[relName] = resourceHash.relationships[relName];
                continue;
            }
            if ('errors' in embeddedObj) {
                if ((embeddedObj as DocWithErrors).errors[0].status === '410' && relName === 'users') {
                    const meta = (embeddedObj as DocWithErrors).errors[0].meta;
                    const metaWithCamelizedKeys = Object.fromEntries(
                        Object.entries(meta!).map(([key, value], _) => [
                            camelize(key), value,
                        ]),
                    );
                    resourceHash.relationships[relName] = {
                        data: {
                            id: resourceHash.id.toString().split('-')[1],
                            type: 'users',
                            meta: metaWithCamelizedKeys,
                        },
                    };
                    continue;
                }
                // Should already be logged elsewhere
                continue;
            }

            // Push the embedded data into the store.  Since it will use this serializer again,
            // this is indirectly recursive and will extract nested embeds.
            this.store.pushPayload(embeddedObj);

            const relationship = resourceHash.relationships[relName];
            const relationshipLinks = 'links' in relationship ? relationship.links : [];

            // Merge links on the embedded object with links on the relationship, so all returned links are available
            const embeddedLinks = {
                ...embeddedObj.links,
                ...relationshipLinks,
            };

            // Construct a new relationship in JSON API format
            if (Array.isArray(embeddedObj.data)) {
                relationships[relName] = {
                    data: embeddedObj.data.map(({ id, type }: { id: string, type: string}) => ({ id, type })),
                    links: embeddedLinks,
                    meta: embeddedObj.meta,
                };
            } else {
                relationships[relName] = {
                    data: {
                        id: embeddedObj.data.id,
                        type: embeddedObj.data.type,
                    },
                    links: embeddedLinks,
                    meta: embeddedObj.meta,
                };
            }
        }

        return { relationships };
    }

    /**
     * Make all links available in the model's `links` attr.
     * Return a new resource hash that only contains attributes, with `attributes.links` set to
     * the combination of `resourceHash.links` and `resourceHash.relationships`
     */
    _mergeLinks(resourceHash: Resource): Partial<Resource> {
        const links: OsfLinks = { ...(resourceHash.links || {}) };
        if (resourceHash.relationships) {
            links.relationships = resourceHash.relationships;
        }
        return {
            attributes: { ...resourceHash.attributes, links: (links as AttributesObject) },
        };
    }

    extractAttributes(modelClass: OsfModel, resourceHash: Resource) {
        const attributeHash = this._mergeLinks(resourceHash);
        return super.extractAttributes(modelClass, attributeHash);
    }

    extractRelationships(modelClass: OsfModel, resourceHash: Resource) {
        const relationshipHash = this._extractEmbeds(resourceHash);
        return super.extractRelationships(modelClass, relationshipHash);
    }

    keyForAttribute(key: string) {
        return underscore(key);
    }

    keyForRelationship(key: string) {
        return underscore(key);
    }

    serialize(snapshot: DS.Snapshot, options: { includeId?: boolean, osf?: OsfSerializerOptions } = {}) {
        const serialized = super.serialize(snapshot, options) as SingleResourceDocument;
        serialized.data.type = underscore(serialized.data.type);

        const includeCleanData = options && options.osf && options.osf.includeCleanData;
        if (!includeCleanData && !snapshot.record.get('isNew')) {
            // Only send dirty attributes in request
            const changedAttributes = snapshot.record.changedAttributes();
            for (const attribute of Object.keys(serialized.data.attributes!)) {
                const { attrs }: { attrs: any } = this;
                const alwaysSerialize = attrs && attrs[attribute] && attrs[attribute].serialize === true;
                if (!alwaysSerialize && !(camelize(attribute) in changedAttributes)) {
                    delete serialized.data.attributes![attribute];
                }
            }

            // The following is a bit of a hack as it relies on currently private information.
            // When https://github.com/emberjs/data/pull/8131 is merged, we should have public access
            // to this data from a new import location.
            if (serialized.data.relationships) {
                const graph = peekGraph(this.store);
                for (const key of Object.keys(serialized.data.relationships)) {
                    const rel = graph.get(recordIdentifierFor(snapshot.record), camelize(key));
                    let isClean = true;
                    if (rel.definition.kind === 'belongsTo') {
                        isClean = rel.localState === rel.remoteState;
                    } else if (rel.definition.kind === 'hasMany') {
                        if (rel.canonicalState.length !== rel.currentState.length) {
                            isClean = false;
                        } else {
                            for (const stateKey in rel.canonicalState) {
                                if(rel.canonicalState[stateKey] !== rel.currentState[stateKey]) {
                                    isClean = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (isClean) {
                        delete serialized.data.relationships[key];
                    }
                }
            }
        }

        return serialized;
    }

    serializeAttribute(snapshot: DS.Snapshot, json: object, key: string, attribute: object): void {
        // In certain cases, a field may be omitted from the server payload, but have a value (undefined)
        // when serialized from the model. (e.g. node.template_from)
        // Omit fields with a value of undefined before sending to the server. (but still allow null to be sent)
        const val = snapshot.attr(key);

        if (val !== undefined) {
            super.serializeAttribute(snapshot, json, key, attribute);
        }
    }

    // `normalize` is used for all resources no matter where they came from,
    // unlike `normalizeSingleResponse` and `normalizeArrayResponse`, which
    // are not used by `store.pushPayload`
    normalize(modelClass: Model, resourceHash: Resource) {
        const normalizedHash = super.normalize(modelClass, resourceHash) as { data: Resource };

        if (normalizedHash.data && normalizedHash.data.relationships) {
            const relatedCounts = Object.entries(normalizedHash.data.relationships).reduce(
                (acc: Record<string, number>, [relName, rel]: [string, any]) => {
                    if (rel.links && rel.links.related && rel.links.related.meta) {
                        const { count } = rel.links.related.meta;
                        if (typeof count === 'number') {
                            acc[camelize(relName)] = count;
                        }
                    }
                    return acc;
                },
                {},
            );

            if (Object.keys(relatedCounts).length !== 0) {
                normalizedHash.data.attributes = {
                    ...(normalizedHash.data.attributes || {}),
                    relatedCounts,
                };
            }
        }
        return normalizedHash;
    }

    normalizeSingleResponse(
        store: Store,
        primaryModelClass: OsfModel,
        payload: SingleResourceDocument,
        id: string,
        requestType: string,
    ) {
        const documentHash = super.normalizeSingleResponse(
            store,
            primaryModelClass,
            payload,
            id,
            requestType,
        ) as SingleResourceDocument;

        if (documentHash.meta) {
            (documentHash.data.attributes!.apiMeta as {}) = documentHash.meta;
        }

        return documentHash;
    }

    normalizeArrayResponse(
        store: Store,
        primaryModelClass: OsfModel,
        payload: ResourceCollectionDocument,
        id: string,
        requestType: string,
    ) {
        const documentHash = super.normalizeArrayResponse(
            store,
            primaryModelClass,
            payload,
            id,
            requestType,
        ) as NormalizedResourceCollectionDocument;

        if (documentHash.meta && documentHash.meta.total && documentHash.meta.per_page) {
            // For any request that returns more than one result, calculate total pages to be loaded.
            documentHash.meta.total_pages = Math.ceil(documentHash.meta.total / documentHash.meta.per_page);
        }

        return documentHash;
    }

    modelNameFromPayloadKey(key: string) {
        if (key in API_TYPE_KEYS) {
            return API_TYPE_KEYS[key];
        }
        return super.modelNameFromPayloadKey(key);
    }

    payloadKeyFromModelName(modelName: keyof ModelRegistry): string {
        for (const [typeKey, model] of Object.entries(API_TYPE_KEYS)) {
            if (model === modelName) {
                return typeKey;
            }
        }
        return super.payloadKeyFromModelName(modelName);
    }
}
