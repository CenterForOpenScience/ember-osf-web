import { A } from '@ember/array';
import NativeArray from '@ember/array/-private/native-array';

import ArrayTransform from './array';

interface Identifiable {
    id: string;
    [key: string]: any;
}

export default class Subjects extends ArrayTransform {
    serialize(value: Identifiable[][]) {
        return A((super.serialize(value) as Identifiable[][])
            .map(item => item.map(({ id }) => id)));
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        subjects: NativeArray<string[]>;
    } // eslint-disable-line semi
}
