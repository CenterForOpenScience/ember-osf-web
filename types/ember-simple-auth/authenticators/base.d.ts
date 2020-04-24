declare module 'ember-simple-auth/authenticators/base' {
    import EmberObject from '@ember/object';
    import Evented from '@ember/object/evented';
    import RSVP from 'rsvp';

    class Base extends EmberObject.extend(Evented) {
        authenticate(...args: any[]): RSVP.Promise;

        invalidate(data?: object, ...args?: any[]): RSVP.Promise;

        restore(data: object): RSVP.Promise;
    }

    export = Base;
}
