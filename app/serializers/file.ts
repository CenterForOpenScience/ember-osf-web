import OsfSerializer from './osf-serializer';

interface ResourceHash {
    attributes: {
        checkout?: string,
    },
    relationships: {
        checkout?: {
            links: {
                related: {
                    meta: {
                        id: string,
                    },
                },
            },
        },
    },
}

export default class File extends OsfSerializer.extend({
    normalize(modelClass: any, resourceHash: ResourceHash): any {
        const hash = resourceHash;
        const checkoutRel = hash.relationships.checkout;
        if (checkoutRel) {
            const { id } = checkoutRel.links.related.meta;
            hash.attributes.checkout = id;
            delete hash.relationships.checkout;
        }
        return this._super(modelClass, hash);
    },
}) {}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data' {
    interface SerializerRegistry {
        'file': File;
    }
}
