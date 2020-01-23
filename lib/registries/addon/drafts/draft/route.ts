import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { TaskInstance } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Analytics from 'ember-osf-web/services/analytics';

export interface DraftRouteModel {
    draftId: string;
    taskInstance: TaskInstance<DraftRegistration>;
}

@requireAuth()
export default class DraftRegistrationRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    @task
    loadModelTask = task(function *(this: DraftRegistrationRoute, draftId: string) {
        try {
            const draftRegistration = yield this.store.findRecord(
                'draft-registration',
                draftId,
                { adapterOptions: { include: 'branched_from' } },
            );
            const node = yield draftRegistration.branchedFrom;
            return { draftRegistration, node };
        } catch (error) {
            this.transitionTo('page-not-found', this.router.currentURL.slice(1));
            return undefined;
        }
    });

    model(params: { id: string }): DraftRouteModel {
        const { id: draftId } = params;
        return {
            draftId,
            taskInstance: this.loadModelTask.perform(draftId),
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
