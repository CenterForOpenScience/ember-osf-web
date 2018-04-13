import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';

type GuidRecord = 'file' | 'node' | 'preprint' | 'registration' | 'user';

/**
 * Base class for the root-level GUID routes, once the GUID's referent type is known.
 */
export default class ResolveGuidRoute extends Route {
    @service ready;
    @service router;

    loadModel = task(function* (this: ResolveGuidRoute, typeName: GuidRecord, id: string) {
        const blocker = this.get('ready').getBlocker();

        try {
            const model = yield this.get('store').findRecord(typeName, id);
            blocker.done();

            return model;
        } catch (error) {
            blocker.errored(error);
            this.transitionTo('not-found', this.get('router').get('currentURL').slice(1));
        }
    });
}
