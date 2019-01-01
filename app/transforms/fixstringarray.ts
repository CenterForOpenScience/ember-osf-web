import { A } from '@ember/array';
import NativeArray from '@ember/array/-private/native-array';

import fixSpecialChars from 'ember-osf-web/utils/fix-special-char';

import ArrayTransform from './array';

export default class FixStringArrayTransform extends ArrayTransform {
    deserialize(value: string) {
        return A(super.deserialize(value).map(item => fixSpecialChars(item)));
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        fixstringarray: NativeArray<string>;
    } // eslint-disable-line semi
}
