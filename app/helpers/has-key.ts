import { helper } from '@ember/component/helper';

export function hasKey([object, key]: [any, any]): any {
    return (key in object);
}

export default helper(hasKey);
