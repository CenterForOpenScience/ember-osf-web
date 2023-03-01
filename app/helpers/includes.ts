import { helper } from '@ember/component/helper';

export function includes([array, value]: [unknown[], unknown]): boolean {
    return array.includes(value);
}

export default helper(includes);
