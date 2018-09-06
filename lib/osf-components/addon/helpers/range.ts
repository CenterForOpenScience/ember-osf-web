import { helper } from '@ember/component/helper';

export function range([min, max]: number[]): number[] {
    const size = (max - min) + 1;

    return size > 0 ? [...Array(size).keys()].map((i: number) => i + min) : [];
}

export default helper(range);
