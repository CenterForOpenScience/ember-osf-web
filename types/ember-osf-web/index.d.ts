import Ember from 'ember';

declare global {
    interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
    // interface Function extends Ember.FunctionPrototypeExtensions {}

    type Newable<T> = new(...args: any[]) => T; // eslint-disable-line space-infix-ops

    interface HTMLElement {
        getAttributeNames(): string[];
    }
}

export {};
