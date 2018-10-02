import { helper } from '@ember/component/helper';

export function ifFilter<T>([element, filter]: [T, T[], boolean]): boolean {
    if (Array.isArray(element)) {
        return !!element.filter(each => filter.includes(each)).length;
    }

    if (typeof filter === 'object') {
        return filter.includes(element);
    }

    return false;
}

export default helper(ifFilter);
