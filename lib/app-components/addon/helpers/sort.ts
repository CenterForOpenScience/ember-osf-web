import Helper from '@ember/component/helper';

export default class Sort extends Helper {
    compute<T>([arr]: [T[]]) {
        return arr.sort();
    }
}
