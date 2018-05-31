import { TestContext } from 'ember-test-helpers';
import getElement, { ElemOrSelector, makeMessage } from './lib/get-element';

export default function notHasClass<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    expected: string,
    message: string = makeMessage(subject, 'does not have class', expected),
) {
    const element = getElement(context, subject);
    const actual = element.getAttribute('class') || '';
    const result = !element.classList.contains(expected);
    this.pushResult({ result, actual, expected, message, negative: true });
}

declare global {
    interface Assert {
        notHasClass(subject: ElemOrSelector, expected: string, message?: string): void;
    }
}
