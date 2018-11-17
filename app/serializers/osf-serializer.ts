import { camelize, underscore } from '@ember/string';
import DS, { ModelRegistry } from 'ember-data';

const { JSONAPISerializer } = DS;

const API_TYPE_KEYS: Record<string, keyof ModelRegistry> = {
    applications: 'developer-app',
};

interface ResourceHash {
    attributes?: {
        links?: any,
    };
    links?: any;
    relationships?: any;
    embeds?: any;
}

interface OsfSerializerOptions {
    includeCleanData?: boolean;
}

export default class OsfSerializer extends JSONAPISerializer.extend({
    /**
     * Get embedded objects from the response and push them into the store.
     * Return a new resource hash that only contains relationships in JSON API format,
     * or the original resource hash, unchanged.
     *
     * @method _extractEmbeds
     * @param {ResourceHash} resourceHash
     * @return {ResourceHash}
     * @private
     */
    _extractEmbeds(this: OsfSerializer, resourceHash: ResourceHash): ResourceHash {
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
            this.get('store').pushPayload(embeddedObj);

            // Merge links on the embedded object with links on the relationship, so all returned links are available
            const embeddedLinks = {
                ...embeddedObj.links,
                ...resourceHash.relationships[relName].links,
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
    },

    /**
     * Make all links available in the model's `links` attr.
     * Return a new resource hash that only contains attributes, with `attributes.links` set to
     * the combination of `resourceHash.links` and `resourceHash.relationships`
     *
     * @method _mergeLinks
     * @param {ResourceHash} resourceHash
     * @return {ResourceHash}
     * @private
     */
    _mergeLinks(this: OsfSerializer, resourceHash: ResourceHash): ResourceHash {
        const links = { ...(resourceHash.links || {}) };
        if (resourceHash.relationships) {
            links.relationships = resourceHash.relationships;
        }
        return {
            attributes: { ...resourceHash.attributes, links },
        };
    },

    extractAttributes(this: OsfSerializer, modelClass: any, resourceHash: ResourceHash): any {
        const attributeHash = this._mergeLinks(resourceHash);
        return this._super(modelClass, attributeHash);
    },

    extractRelationships(this: OsfSerializer, modelClass: any, resourceHash: ResourceHash): any {
        const relationshipHash = this._extractEmbeds(resourceHash);
        return this._super(modelClass, relationshipHash);
    },

    keyForAttribute(key: string): string {
        return underscore(key);
    },

    keyForRelationship(key: string): string {
        return underscore(key);
    },

    serialize(snapshot: DS.Snapshot, options?: { osf?: OsfSerializerOptions }): any {
        const serialized = this._super(snapshot, options);
        serialized.data.type = underscore(serialized.data.type);

        const includeCleanData = options && options.osf && options.osf.includeCleanData;
        if (!includeCleanData && !snapshot.record.get('isNew')) {
            // Only send dirty attributes and relationships in request
            const changedAttributes = snapshot.record.changedAttributes();
            for (const attribute of Object.keys(serialized.data.attributes)) {
                const { attrs }: { attrs: any } = this;
                const alwaysSerialize = attrs && attrs[attribute] && attrs[attribute].serialize === true;
                if (!alwaysSerialize && !(camelize(attribute) in changedAttributes)) {
                    delete serialized.data.attributes[attribute];
                }
            }
            // HACK: There's no public-API way to tell whether a relationship has been changed.
            const relationships = (snapshot as any)._internalModel._relationships.initializedRelationships;
            if (serialized.data.relationships) {
                for (const key of Object.keys(serialized.data.relationships)) {
                    const rel = relationships[camelize(key)];
                    if (rel
                        && rel.members.length === rel.canonicalMembers.length
                        && rel.members.list.every((v: any, i: any) => v === rel.canonicalMembers.list[i])
                    ) {
                        delete serialized.data.relationships[key];
                    }
                }
            }
        }

        return serialized;
    },

    serializeAttribute(snapshot: DS.Snapshot, json: object, key: string, attribute: object): void {
        // In certain cases, a field may be omitted from the server payload, but have a value (undefined)
        // when serialized from the model. (e.g. node.template_from)
        // Omit fields with a value of undefined before sending to the server. (but still allow null to be sent)
        const val = snapshot.attr(key);

        if (val !== undefined) {
            this._super(snapshot, json, key, attribute);
        }
    },

    normalizeSingleResponse(
        store: DS.Store,
        primaryModelClass: any,
        payload: any,
        id: string,
        requestType: string,
    ): any {
        const documentHash = this._super(store, primaryModelClass, payload, id, requestType);
        if (documentHash.meta) {
            documentHash.data.attributes.apiMeta = documentHash.meta;
        }
        if (documentHash.data.relationships) {
            documentHash.data.attributes.relatedCounts = Object.entries(documentHash.data.relationships).reduce(
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
    },

    normalizeArrayResponse(...args: any[]): any {
        const documentHash: any = this._super(...args);

        if (documentHash.meta && documentHash.meta.total && documentHash.meta.per_page) {
            // For any request that returns more than one result, calculate total pages to be loaded.
            documentHash.meta.total_pages = Math.ceil(documentHash.meta.total / documentHash.meta.per_page);
        }

        return documentHash;
    },

    modelNameFromPayloadKey(key: string): keyof ModelRegistry {
        if (key in API_TYPE_KEYS) {
            return API_TYPE_KEYS[key];
        }
        return this._super(key);
    },

    payloadKeyFromModelName(modelName: keyof ModelRegistry): string {
        for (const [typeKey, model] of Object.entries(API_TYPE_KEYS)) {
            if (model === modelName) {
                return typeKey;
            }
        }
        return this._super(modelName);
    },
}) {
    attrs = {
        links: {
            serialize: false,
        },
        relatedCounts: {
            serialize: false,
        },
    };
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'osf-serializer': OsfSerializer;
    }
}
