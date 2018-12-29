import FileModel from 'ember-osf-web/models/file';

import { Resource } from 'osf-api';

import OsfSerializer from './osf-serializer';

export default class FileSerializer extends OsfSerializer {
    normalize(modelClass: FileModel, resourceHash: Resource) {
        const hash = resourceHash;
        const checkoutRel = hash.relationships!.checkout;
        if (checkoutRel && 'links' in checkoutRel) {
            const { related } = checkoutRel.links;
            if (typeof related === 'object') {
                const { id } = related.meta!;
                if (id) {
                    hash.attributes!.checkout = id;
                    delete hash.relationships!.checkout;
                }
            }
        }
        return super.normalize(modelClass, hash);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        file: File;
    } // eslint-disable-line semi
}
