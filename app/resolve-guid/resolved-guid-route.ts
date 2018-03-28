import { get } from '@ember/object';
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

    loadModel: task(function* (typeName: string, id: string) {
        const blocker = get(this, 'ready').block();
        try {
            const model = yield get(this, 'store').findRecord(typeName, id);
            blocker.done();
            return model;
        } catch (error) {
            blocker.errored(error);
            this.transitionTo('not-found', this.get('router.currentURL').slice(1));
        }
    }),
});
