import { TestContext } from 'ember-test-helpers';

export default function <%= camelName %><Context extends TestContext>(
    this: Assert,
    _: Context, // change to "context: TestContext," to use context
    // arg1: any,
    // arg2: any,
) {
    // see: https://api.qunitjs.com/assert/pushResult/ for more information
    this.pushResult({
        result: true,
        actual: '',
        expected: '',
        message: '',
    });
}

declare global {
    interface Assert {
        <%= camelName %>(/* arg1: any, arg2: any */): void;
    }
}
