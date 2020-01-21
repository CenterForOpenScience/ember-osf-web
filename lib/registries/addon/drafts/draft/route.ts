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
import DraftRegistrationManager, { DraftRegistrationAndNode } from 'registries/drafts/draft/draft-registration-manager';
import NavigationManager from 'registries/drafts/draft/navigation-manager';

export interface DraftRouteModel {
    draftId: string;
    taskInstance: DraftRegistrationAndNode;
    draftRegistrationManager: DraftRegistrationManager;
    navigationManager: NavigationManager;
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
        const draftRegistrationManager = new DraftRegistrationManager(taskInstance);
        const navigationManager = new NavigationManager(draftRegistrationManager);
        return {
            draftId,
            taskInstance,
            navigationManager,
            draftRegistrationManager,
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
