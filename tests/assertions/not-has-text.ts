import { TestContext } from 'ember-test-helpers';
import getElement, { ElemOrSelector, makeMessage } from './lib/get-element';

export default function notHasText<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    message: string = makeMessage(subject, 'does not have text'),
) {
    const actual = getElement(context, subject).innerText
        .trim()
        .replace(/\s+/g, ' ');
    const expected = '';
    const result = actual === expected;
    this.pushResult({ result, actual, expected, message });
}

declare global {
    interface Assert {
        notHasText(subject: ElemOrSelector, message?: string): void;
    }
}
