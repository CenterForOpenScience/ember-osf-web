import { TestContext } from 'ember-test-helpers';
import getElement, { ElemOrSelector, makeMessage } from './lib/get-element';

export default function hasText<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    expected: string,
    message: string = makeMessage(subject, 'has text', expected),
) {
    const actual = getElement(context, subject).innerText.trim();
    const result = actual === expected;
    this.pushResult({ result, actual, expected, message });
}

declare global {
    interface Assert {
        hasText(subject: ElemOrSelector, expected: string, message?: string): void;
    }
}
