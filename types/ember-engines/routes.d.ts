declare module 'ember-engines/routes' {
    import Ember from 'ember';

    export default function buildRoutes(callback: (this: Ember.RouterDSL) => void): void;
}
