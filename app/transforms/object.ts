import Transform from '@ember-data/serializer/transform';
import $ from 'jquery';

export default class ObjectTransform extends Transform {
    deserialize(value: any) {
        if ($.isPlainObject(value)) {
            return value;
        }
        return {};
    }

    serialize(value: any) {
        if ($.isPlainObject(value)) {
            return value;
        }
        return {};
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        object: {};
    } // eslint-disable-line semi
}
