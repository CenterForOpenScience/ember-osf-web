import fixSpecialChars from 'ember-osf-web/utils/fix-special-char';

import ArrayTransform from './array';

export default class FixStringArrayTransform extends ArrayTransform {
    deserialize(value: any) {
        return super.deserialize(value).map((item: string) => fixSpecialChars(item));
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        fixstringarray: string[];
    } // eslint-disable-line semi
}
