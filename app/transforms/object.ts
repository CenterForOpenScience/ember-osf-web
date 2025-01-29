import Transform from '@ember-data/serializer/transform';
import $ from 'jquery';

import { camelizeKeys, snakifyKeys } from 'ember-osf-web/utils/map-keys';

export default class ObjectTransform extends Transform {
    deserialize(value: any, options?: any) {
        if ($.isPlainObject(value)) {
            return options?.snakifyForApi ? camelizeKeys(value, true) : value;
        }
        return {};
    }

    serialize(value: any, options?: any) {
        if ($.isPlainObject(value)) {
            return options?.snakifyForApi ? snakifyKeys(value, true) : value;
        }
        return {};
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        object: {};
    } // eslint-disable-line semi
}
