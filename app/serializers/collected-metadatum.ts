import DS from 'ember-data';
import isHybridGuid from 'ember-osf-web/utils/is-hybrid-guid';
import Osf from './osf-serializer';

export default class CollectedMetadatum extends Osf.extend({
    /**
     * Guid is an attribute on create
     */
    serialize(snapshot: DS.Snapshot, options: any) {
        const serialized = this._super(snapshot, options);
        const { data, data: { attributes, relationships } } = serialized;

        data.type = 'collected-metadata';
        attributes.guid = relationships.guid.data.id;

        delete relationships.guid;

        return serialized;
    },

    /**
     * Collected-Metadata IDs must be combined with the collection ID, so that there are no conflicts in the store
     */
    extractId(modelClass: 'collected-metadata', resourceHash: any): string {
        const resourceId: string = this._super(modelClass, resourceHash);

        if (isHybridGuid(resourceId)) {
            return resourceId;
        }

        return `${resourceHash.relationships.collection.data.id}-${resourceId}`;
    },
}) {
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'collected-metadatum': CollectedMetadatum;
    }
}
