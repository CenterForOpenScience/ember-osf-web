import DS from 'ember-data';

import { Resource } from 'osf-api';

import isHybridGuid from 'ember-osf-web/utils/is-hybrid-guid';

import OsfSerializer from './osf-serializer';

export default class CollectedMetadatumSerializer extends OsfSerializer {
    /**
     * Guid is an attribute on create
     */
    serialize(snapshot: DS.Snapshot, options: {}) {
        const serialized = super.serialize(snapshot, options);
        const { data, data: { attributes, relationships } } = serialized;

        data.type = 'collected-metadata';
        if (relationships && 'guid' in relationships) {
            const { guid } = relationships;
            if ('data' in guid) {
                const { data: guidData } = guid;
                if (guidData && 'id' in guidData) {
                    attributes!.guid = guidData.id;
                    delete relationships.guid;
                }
            }
        }

        return serialized;
    }

    /**
     * Collected-Metadata IDs must be combined with the collection ID, so that there are no conflicts in the store
     */
    extractId(modelClass: 'collected-metadata', resourceHash: Resource) {
        const resourceId = super.extractId(modelClass, resourceHash);

        if (isHybridGuid(resourceId)) {
            return resourceId;
        }

        let collectionId = '';
        const { collection } = resourceHash.relationships!;
        if ('data' in collection) {
            const { data } = collection;
            if (data && 'id' in data) {
                collectionId = data.id;
            }
        }

        return `${collectionId}-${resourceId}`;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'collected-metadatum': CollectedMetadatumSerializer;
    } // eslint-disable-line semi
}
