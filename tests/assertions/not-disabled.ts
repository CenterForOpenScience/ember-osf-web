import { TestContext } from 'ember-test-helpers';
import getElement, { ElemOrSelector, makeMessage } from './lib/get-element';

export default function notDisabled<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    message: string = makeMessage(subject, 'is not disabled'),
) {
    const actual = getElement(context, subject).getAttributeNames().includes('disabled') ? 'disabled' : '';
    const expected = 'disabled';
    const result = !actual;
    this.pushResult({ result, actual, expected, message, negative: true });
}

declare global {
    interface Assert {
        notDisabled(subject: ElemOrSelector, message?: string): void;
    }
}
