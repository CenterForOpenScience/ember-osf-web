import RouterDSL from '@ember/routing/-private/router-dsl';

declare module 'ember-engines/routes' {
    export default function buildRoutes(callback: (this: RouterDSL) => void): void;
}
