import Store from '@ember-data/store';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import Analytics from 'ember-osf-web/services/analytics';
import RevisionNavigationManager from 'registries/edit-revision/nav-manager';
import RevisionManager from 'registries/edit-revision/revision-manager';

export interface EditRevisionRouteModel {
    navigationManager: RevisionNavigationManager;
    revisionManager: RevisionManager;
}

@requireAuth()
export default class EditRevisionRoute extends Route {
    @service analytics!: Analytics;
    @service store!: Store;
    @service router!: RouterService;

    @task
    @waitFor
    async loadModels(revisionId: string) {
        const revision = await this.store.findRecord('schema-response', revisionId);
        const registration = await revision.registration;
        const provider = await registration.provider;
        if ((registration.currentUserIsReadOnly && revision.reviewState !== RevisionReviewStates.Approved) ||
            (revision.reviewState !== RevisionReviewStates.RevisionInProgress)) {
            this.replaceWith('edit-revision.review', revisionId);
        }
        return {
            revision,
            registration,
            provider,
        };
    }

    model(params: { revisionId: string }) {
        const { revisionId } = params;
        const loadModelsTask = taskFor(this.loadModels).perform(revisionId);
        const revisionManager = new RevisionManager(loadModelsTask, revisionId);
        const navigationManager = new RevisionNavigationManager(revisionManager);
        return {
            navigationManager,
            revisionManager,
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
