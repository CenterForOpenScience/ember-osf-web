import Ember from 'ember';

declare global {
    interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
    // interface Function extends Ember.FunctionPrototypeExtensions {}

    type Newable<T> = new(...args: any[]) => T;

    interface HTMLElement {
        getAttributeNames(): string[];
    }
}

export {};
