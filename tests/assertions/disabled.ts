import { TestContext } from 'ember-test-helpers';
import getElement, { ElemOrSelector, makeMessage } from './lib/get-element';

export default function disabled<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    message: string = makeMessage(subject, 'is disabled'),
) {
    const actual = getElement(context, subject).getAttributeNames().includes('disabled') ? 'disabled' : '';
    const expected = 'disabled';
    const result = !!actual;
    this.pushResult({ result, actual, expected, message });
}

declare global {
    interface Assert {
        disabled(subject: ElemOrSelector, message?: string): void;
    }
}
