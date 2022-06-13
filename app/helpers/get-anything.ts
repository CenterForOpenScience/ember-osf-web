import { helper } from '@ember/component/helper';

export function getAnything([object, key]: [any, any]): any {
    return object.get(key);
}

export default helper(getAnything);
