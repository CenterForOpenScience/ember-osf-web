import { TestContext } from 'ember-test-helpers';
import { ElemOrSelector, makeMessage } from './lib/get-element';

export default function found<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    message: string = makeMessage(subject, 'found'),
) {
    const result = !!(typeof subject === 'string' ? context.element.querySelector(subject) : subject);
    const actual = result ? 'found' : 'not found';
    const expected = 'found';
    this.pushResult({ result, actual, expected, message });
}

declare global {
    interface Assert {
        found(subject: ElemOrSelector, message?: string): void;
    }
}
