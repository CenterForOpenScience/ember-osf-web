import Transform from '@ember-data/serializer/transform';

import { NodeLicense } from 'ember-osf-web/models/node';
import { camelizeKeys, snakifyKeys } from 'ember-osf-web/utils/map-keys';

interface SerializedNodeLicense {
    copyright_holders?: string[]; // eslint-disable-line camelcase
    year?: string;
}

interface DeserializedNodeLicense {
    copyrightHolders?: string[];
    year?: string;
}

export default class NodeLicenseTransform extends Transform {
    deserialize(value: SerializedNodeLicense): NodeLicense {
        if (!value) {
            return Object.freeze({});
        }

        const {
            copyrightHolders = [],
            year = '',
        } = camelizeKeys(value) as DeserializedNodeLicense;

        return Object.freeze({
            copyrightHolders: typeof copyrightHolders === 'string' ? copyrightHolders : copyrightHolders.join(', '),
            year,
        });
    }

    serialize(value: NodeLicense): SerializedNodeLicense | undefined {
        if (!value || Object.entries(value).length === 0) {
            return undefined;
        }

        const {
            copyrightHolders = '',
            year = '',
        } = value;

        return snakifyKeys({
            copyrightHolders: copyrightHolders
                .split(', ')
                .map(s => s.trim()),
            year,
        });
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        'node-license': NodeLicenseTransform;
    } // eslint-disable-line semi
}
