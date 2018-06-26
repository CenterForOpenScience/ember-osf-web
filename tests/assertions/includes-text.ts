import { TestContext } from 'ember-test-helpers';
import getElement, { ElemOrSelector, makeMessage } from './lib/get-element';

export default function includesText<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    expected: string,
    message: string = makeMessage(subject, 'includes text', expected),
) {
    const actual = getElement(context, subject).innerText.trim();
    const result = actual.includes(expected);
    this.pushResult({ result, actual, expected, message });
}

declare global {
    interface Assert {
        includesText(subject: ElemOrSelector, expected: string, message?: string): void;
    }
}
