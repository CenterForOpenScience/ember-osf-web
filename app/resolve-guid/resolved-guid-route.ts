import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

/**
 * Base class for the root-level GUID routes, once the GUID's referent type is known.
 *
 * Not an ES6 class, so it can be further extended without confusing Ember's _super
 */
export default Route.extend({
    ready: service('ready'),

    loadModel: task(function* (this: Route, typeName: string, id: string) {
        const blocker = this.get('ready').block();
        try {
            const model = yield this.get('store').findRecord(typeName, id);
            blocker.done();
            return model;
        } catch (e) {
            blocker.errored(e);
            this.transitionTo('not-found', this.get('router.currentURL').slice(1));
        }
    }),
});
