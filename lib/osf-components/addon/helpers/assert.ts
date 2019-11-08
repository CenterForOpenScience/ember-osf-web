import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';

export function assertHelper([description, condition]: [string, boolean]) {
    assert(description, condition);
}

export default helper(assertHelper);
