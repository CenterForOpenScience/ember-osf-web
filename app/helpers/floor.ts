import { helper } from '@ember/component/helper';

export function floor([num]: [number]): number {
    return Math.floor(num);
}

export default helper(floor);
