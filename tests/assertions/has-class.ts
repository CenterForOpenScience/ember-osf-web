import { TestContext } from 'ember-test-helpers';
import getElement, { ElemOrSelector, makeMessage } from './lib/get-element';

export default function hasClass<Context extends TestContext>(
    this: Assert,
    context: Context,
    subject: ElemOrSelector,
    expected: string,
    message: string = makeMessage(subject, 'has class', expected),
) {
    const element = getElement(context, subject);
    const actual = element.getAttribute('class') || '';
    const result = element.classList.contains(expected);
    this.pushResult({ result, actual, expected, message });
}

declare global {
    interface Assert {
        hasClass(subject: ElemOrSelector, expected: string, message?: string): void;
    }
}
