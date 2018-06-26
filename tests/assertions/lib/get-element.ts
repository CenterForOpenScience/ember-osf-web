import { TestContext } from 'ember-test-helpers';

export type ElemOrSelector = Element | string | null;

export default function<Context extends TestContext>(context: Context, subject: ElemOrSelector) {
    const element = typeof subject === 'string' ? context.element.querySelector(subject) : subject;
    if (!element) {
        throw new Error(`Element not found${typeof subject === 'string' ? ` for selector '${subject}'` : ''}!`);
    }
    return element as HTMLElement;
}

export function makeMessage(subject: ElemOrSelector, test: string, expected?: string) {
    const atSelector = typeof subject === 'string' ? ` at selector '${subject}'` : '';
    const exp = expected ? ` '${expected}'` : '';
    return `Element${atSelector} ${test}${exp}.`;
}
