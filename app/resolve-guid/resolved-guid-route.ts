import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';

import { ReferentModelName } from 'ember-osf-web/models/guid';
import GuidContext from 'ember-osf-web/services/guid-context';
import Ready from 'ember-osf-web/services/ready';

/**
 * Base class for the root-level GUID routes
 */
export default class ResolveGuidRoute extends Route {
    @service ready!: Ready;
    @service router!: any;
    @service guidContext!: GuidContext;

    resolveGuid = task(function *(this: ResolveGuidRoute, guid: string, expectedType?: ReferentModelName) {
        const blocker = this.ready.getBlocker();

        try {
            const model = yield this.guidContext.setContext(guid, expectedType);
            blocker.done();
            return model;
        } catch (error) {
            blocker.errored(error);
            this.transitionTo('not-found', this.router.currentURL.slice(1));
            throw error;
        }
    });

    deactivate() {
        super.deactivate();
        this.guidContext.clearContext();
    }
}
