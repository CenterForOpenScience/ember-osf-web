import { TestContext } from 'ember-test-helpers';
import { ElemOrSelector, makeMessage } from './lib/get-element';

export default function notFound<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    message: string = makeMessage(subject, 'not found'),
) {
    const result = !(typeof subject === 'string' ? context.element.querySelector(subject) : subject);
    const actual = result ? 'not found' : 'found';
    const expected = 'not found';
    this.pushResult({ result, actual, expected, message, negative: false });
}

declare global {
    interface Assert {
        notFound(subject: ElemOrSelector, message?: string): void;
    }
}
