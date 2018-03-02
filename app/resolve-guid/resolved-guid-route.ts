import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';

/**
 * Base class for the root-level GUID routes, once the GUID's referent type is known.
 *
 * Not an ES6 class, so it can be further extended without confusing Ember's _super
 */
export default Route.extend({
    loadModel: task(function* (this: Route, typeName, id) {
        try {
            return yield this.get('store').findRecord(typeName, id);
        } catch (error) {
            this.transitionTo('not-found', this.get('router.currentURL').slice(1));
        }
    }),
});
