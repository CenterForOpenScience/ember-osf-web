import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import { DraftRegistrationAndNode, DraftRegistrationManager } from 'registries/drafts/draft/draft-registration-manager';

export interface DraftRouteModel {
    draftId: string;
    taskInstance: DraftRegistrationAndNode;
    draftRegistrationManager: DraftRegistrationManager;
}

@requireAuth()
export default class DraftRegistrationRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    @task
    loadModelTask = task(function *(this: DraftRegistrationRoute, draftId: string) {
        try {
            const draftRegistration: DraftRegistration = yield this.store.findRecord(
                'draft-registration',
                draftId,
                { adapterOptions: { include: 'branched_from' } },
            );
            const node: NodeModel = yield draftRegistration.branchedFrom;
            return { draftRegistration, node };
        } catch (error) {
            this.transitionTo('page-not-found', this.router.currentURL.slice(1));
            return undefined;
        }
    });

    model(params: { id: string }): DraftRouteModel {
        const { id: draftId } = params;
        const taskInstance = this.loadModelTask.perform(draftId);
        return {
            draftId,
            taskInstance,
            draftRegistrationManager: new DraftRegistrationManager(taskInstance),
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
