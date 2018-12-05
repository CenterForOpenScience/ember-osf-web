import { A } from '@ember/array';
import { helper } from '@ember/component/helper';

export function array<T>(args: T[]): T[] {
    return A(args);
}

export default helper(array);
