import { helper } from '@ember/component/helper';

export function range([min, max]: number[]): number[] {
    const size = (max - min) + 1;

    return new Array(size)
        .fill(0)
        .map((item: number, i: number) => i + min);
}

export default helper(range);
