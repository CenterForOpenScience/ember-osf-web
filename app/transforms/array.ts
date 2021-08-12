import Transform from '@ember-data/serializer/transform';
import { A } from '@ember/array';
import NativeArray from '@ember/array/-private/native-array';

export default class ArrayTransform extends Transform {
    deserialize(value: any) {
        return A(Array.isArray(value) ? value : []);
    }

    serialize(value: any) {
        return A(Array.isArray(value) ? value : []);
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        array: NativeArray<any>;
    } // eslint-disable-line semi
}
