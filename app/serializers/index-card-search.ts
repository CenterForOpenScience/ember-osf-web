import * as JSONAPI from 'jsonapi-typescript';

import ShareSerializer from './share-serializer';

export default class IndexCardSearchSerializer extends ShareSerializer {
    // Taken from osf-serializer.ts
    _mergeLinks(resourceHash: JSONAPI.ResourceObject): Partial<JSONAPI.ResourceObject> {
        const links = { ...(resourceHash.links || {}) };
        return {
            attributes: { ...resourceHash.attributes, links: (links as any) },
        };
    }

    extractAttributes(modelClass: any, resourceHash: JSONAPI.ResourceObject) {
        const attributeHash = this._mergeLinks(resourceHash);
        return super.extractAttributes(modelClass, attributeHash);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'index-card-search': IndexCardSearchSerializer;
    } // eslint-disable-line semi
}
