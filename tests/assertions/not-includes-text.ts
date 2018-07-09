import { TestContext } from 'ember-test-helpers';
import getElement, { ElemOrSelector, makeMessage } from './lib/get-element';

export default function notIncludesText<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    expected: string,
    message: string = makeMessage(subject, 'does not include text', expected),
) {
    const actual = getElement(context, subject).innerText
        .trim()
        .replace(/\s+/g, ' ');
    const result = !actual.includes(expected);
    this.pushResult({ result, actual, expected, message, negative: true });
}

declare global {
    interface Assert {
        notIncludesText(subject: ElemOrSelector, expected: string, message?: string): void;
    }
}
