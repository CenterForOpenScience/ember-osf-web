import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';
import DS from 'ember-data';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import Analytics from 'ember-osf-web/services/analytics';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import NavigationManager from 'registries/drafts/draft/navigation-manager';

export interface DraftRouteModel {
    draftRegistrationManager: DraftRegistrationManager;
    navigationManager: NavigationManager;
}

@requireAuth()
export default class DraftRegistrationRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    @task({ withTestWaiter: true })
    async loadDraftRegistrationAndNode(draftId: string) {
        try {
            const draftRegistration = await this.store.findRecord(
                'draft-registration',
                draftId,
                { adapterOptions: { include: 'branched_from' } },
            );
            const [subjects, node, provider] = await Promise.all([
                draftRegistration.loadAll('subjects'),
                draftRegistration.branchedFrom,
                draftRegistration.provider,
            ]);

            draftRegistration.setProperties({ subjects });
            return { draftRegistration, node, provider };
        } catch (error) {
            this.transitionTo('page-not-found', this.router.currentURL.slice(1));
            return undefined;
        }
    }

    model(params: { id: string }): DraftRouteModel {
        const { id: draftId } = params;
        const draftRegistrationAndNodeTask = taskFor(this.loadDraftRegistrationAndNode).perform(draftId);
        const draftRegistrationManager = new DraftRegistrationManager(draftRegistrationAndNodeTask);
        const navigationManager = new NavigationManager(draftRegistrationManager);
        return {
            navigationManager,
            draftRegistrationManager,
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
