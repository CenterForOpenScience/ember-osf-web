import { camelize, underscore } from '@ember/string';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { AttributesObject } from 'jsonapi-typescript';

import {
    PaginatedMeta,
    Resource,
    ResourceCollectionDocument,
    SingleResourceDocument,
} from 'osf-api';

import OsfModel, { OsfLinks } from 'ember-osf-web/models/osf-model';

const { JSONAPISerializer } = DS;

const API_TYPE_KEYS: Record<string, keyof ModelRegistry> = {
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
            // Only send dirty attributes and relationships in request
            const changedAttributes = snapshot.record.changedAttributes();
            for (const attribute of Object.keys(serialized.data.attributes!)) {
                const { attrs }: { attrs: any } = this;
                const alwaysSerialize = attrs && attrs[attribute] && attrs[attribute].serialize === true;
                if (!alwaysSerialize && !(camelize(attribute) in changedAttributes)) {
                    delete serialized.data.attributes![attribute];
                }
            }
            // HACK: There's no public-API way to tell whether a relationship has been changed.
            const relationships = (snapshot as any)._internalModel._relationships.initializedRelationships;
            if (serialized.data.relationships) {
                for (const key of Object.keys(serialized.data.relationships)) {
                    const rel = relationships[camelize(key)];
                    if (rel
                        && rel.members.list.length === rel.canonicalMembers.list.length
                        && rel.members.list.every((v: any, i: any) => v === rel.canonicalMembers.list[i])
                    ) {
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

    normalizeSingleResponse(
        store: DS.Store,
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

        if (documentHash.data.relationships) {
            documentHash.data.attributes!.relatedCounts = Object.entries(documentHash.data.relationships).reduce(
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
        }

        return documentHash;
    }

    normalizeArrayResponse(
        store: DS.Store,
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
