import Ember from 'ember';

declare global {
    interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
    // interface Function extends Ember.FunctionPrototypeExtensions {}

    // Use Subclass<T> to allow abstract and non-abstract subclasses of T
    // Use ConcreteSubclass<T> to allow only non-abstract subclasses of T
    type Subclass<T> = Function & { prototype: T }; // tslint:disable-line ban-types
    type ConcreteSubclass<T> = new(...args: any[]) => T;

    interface HTMLElement {
        getAttributeNames(): string[];
    }
}

export {};
