import Route from '@ember/routing/route';
/**
 * This functionality is only available in ember-engines
 * http://ember-engines.com/guide/linking-and-external-links
 * https://github.com/ember-engines/ember-engines/blob/85ac004478f357fbdec34110613f7569c7dccece/addon/
 * -private/route-ext.js
 */
declare module '@ember/routing/route' {
    class EngineRoute extends Route {
        replaceWithExternal(name: string, ...args: any[]): Transition;
        transitionToExternal(name: string, ...args: any[]): Transition;
    }

    export = EngineRoute;
}
