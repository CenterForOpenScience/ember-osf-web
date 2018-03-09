import { underscore, camelize } from '@ember/string';
import $ from 'jquery';
import DS from 'ember-data';

interface ResourceHash {
    attributes: {
        links?: any,
    },
    links?: any,
    relationships?: any,
    embeds?: any,
}

const OsfSerializer = DS.JSONAPISerializer.extend({
    attrs: {
        links: {
            serialize: false,
        },
        embeds: {
            serialize: false,
        },
    },

    // Map from relationship field name to type. Override to serialize relationships.
    relationshipTypes: {},

    /**
     * Extract information about records embedded inside this request
     * @method _extractEmbeds
     * @param {Object} resourceHash
     * @return {Array}
     * @private
     */
    // TODO: refactor using resource hash like how we are using it here: (stuff like _mergeFields should be as easy as just assigning a copy object)

    /* eslint-disable no-param-reassign */
    _extractEmbeds(resourceHash: ResourceHash): any {
        if (!resourceHash.embeds) {
            return []; // Nothing to do
        }
        let included = [];
        resourceHash.relationships = resourceHash.relationships || {};
        for (const embedded of Object.keys(resourceHash.embeds)) {
            if (!(embedded || resourceHash.embeds[embedded])) {
                continue;
            }
            // TODO Pagination probably breaks here
            const data = resourceHash.embeds[embedded].data || resourceHash.embeds[embedded];
            if (!('errors' in data)) {
                this.store.pushPayload({ data });
            }
            if (Array.isArray(data)) {
                included = included.concat(data);
            } else {
                included.push(data);
            }
            resourceHash.embeds[embedded].type = embedded;
            // Merges links returned from embedded object with relationship links, so all returned links are available.
            const embeddedLinks = resourceHash.embeds[embedded].links || {};
            resourceHash.embeds[embedded].links = Object.assign(embeddedLinks, resourceHash.relationships[embedded].links);
            resourceHash.relationships[embedded] = resourceHash.embeds[embedded];
            resourceHash.relationships[embedded].is_embedded = true;
        }
        delete resourceHash.embeds;
        // Recurse in, includeds are only processed on the top level. Embeds are nested.
        return included.concat(included.reduce((acc, include) => acc.concat(this._extractEmbeds(include)), []));
    },

    _mergeFields(resourceHash: ResourceHash): ResourceHash {
        // ApiV2 `links` exist outside the attributes field; make them accessible to the data model
        if (resourceHash.links) { // TODO: Should also test whether model class defines a links field
            resourceHash.attributes.links = resourceHash.links;
        }
        this._extractEmbeds(resourceHash);

        if (resourceHash.relationships && resourceHash.attributes.links) {
            resourceHash.attributes.links = $.extend(resourceHash.attributes.links, {
                relationships: resourceHash.relationships,
            });
        }
        return resourceHash;
    },

    /* eslint-enable no-param-reassign */

    extractAttributes(modelClass: any, resourceHash: ResourceHash): any {
        const hash = this._mergeFields(resourceHash);
        return this._super(modelClass, hash);
    },

    keyForAttribute(key: string): string {
        return underscore(key);
    },

    keyForRelationship(key: string): string {
        return underscore(key);
    },

    serialize(snapshot: DS.Snapshot, options: object): any {
        const serialized = this._super(snapshot, options);
        serialized.data.type = underscore(serialized.data.type);
        // Only send dirty attributes in request
        if (!snapshot.record.get('isNew')) {
            for (const attribute of Object.keys(serialized.data.attributes)) {
                if (!(camelize(attribute) in snapshot.record.changedAttributes())) {
                    delete serialized.data.attributes[attribute];
                }
            }
        }

        // Only serialize dirty, whitelisted relationships
        serialized.data.relationships = {};
        for (const relationship of Object.keys(snapshot.record._dirtyRelationships)) {
            // https://stackoverflow.com/questions/29004314/why-are-object-keys-and-for-in-different
            if (!snapshot.record._dirtyRelationships.hasOwnProperty(relationship)) continue; // eslint-disable-line no-prototype-builtins
            const type = this.get('relationshipTypes')[relationship];
            if (type) {
                const changeLists = Object.values(snapshot.record._dirtyRelationships[relationship]);
                if (changeLists.any(l => l.length)) {
                    serialized.data.relationships[underscore(relationship)] = {
                        data: {
                            id: snapshot.belongsTo(relationship, { id: true }),
                            type,
                        },
                    };
                }
            }
        }
        return serialized;
    },

    serializeAttribute(snapshot: DS.Snapshot, json: any, key: string): void {
        // In certain cases, a field may be omitted from the server payload, but have a value (undefined)
        // when serialized from the model. (eg node.template_from)
        // Omit fields with a value of undefined before sending to the server. (but still allow null to be sent)
        const val = snapshot.attr(key);
        if (val !== undefined) {
            this._super(...arguments);
        }
    },

    normalizeArrayResponse(): any {
        const documentHash: any = this._super(...arguments);
        if (documentHash.meta !== undefined && documentHash.meta.total !== undefined && documentHash.meta.per_page !== undefined) {
            // For any request that returns more than one result, calculate total pages to be loaded.
            documentHash.meta.total_pages = Math.ceil(documentHash.meta.total / documentHash.meta.per_page);
        }
        return documentHash;
    },
});

export default OsfSerializer;


declare module 'ember-data' {
    interface SerializerRegistry {
        'osf-serializer': OsfSerializer;
    }
}
