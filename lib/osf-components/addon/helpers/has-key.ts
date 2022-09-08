import { helper } from '@ember/component/helper';

export function hasKey([object, key]: [any, any]): any {
    if (object) {
        return (key in object);
    }
    return false;
}

export default helper(hasKey);
