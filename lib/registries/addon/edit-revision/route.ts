import { getOwner } from '@ember/application';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import Transition from '@ember/routing/-private/transition';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import Analytics from 'ember-osf-web/services/analytics';
import captureException from 'ember-osf-web/utils/capture-exception';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';
import RevisionNavigationManager from 'registries/edit-revision/nav-manager';
import RevisionManager, { LoadModelsTask } from 'registries/edit-revision/revision-manager';
export interface EditRevisionRouteModel {
    navigationManager: RevisionNavigationManager;
    revisionManager: RevisionManager;
}

@requireAuth()
export default class EditRevisionRoute extends Route {
    @service analytics!: Analytics;
    @service store!: Store;
    @service router!: RouterService;
    @service intl!: IntlService;

    @task
    @waitFor
    async loadModels(revisionId: string) {
        try {
            const revision = await this.store.findRecord('schema-response', revisionId);
            const registration = await revision.registration;
            const provider = await registration.provider;
            if ((registration.currentUserIsReadOnly) ||
                (revision.reviewsState !== RevisionReviewStates.RevisionInProgress)) {
                this.replaceWith('edit-revision.review', revisionId);
            }
            if (revision.reviewsState === RevisionReviewStates.Approved || !provider.allowUpdates) {
                this.transitionTo('overview', registration.id,
                    { queryParams: { revisionId } });
            }
            return {
                revision,
                registration,
                provider,
            };
        } catch (error) {
            captureException(error);
            return this.transitionTo('page-not-found', notFoundURL(this.router.currentURL));
        }
    }

    model(params: { revisionId: string }) {
        const { revisionId } = params;
        const loadModelsTask = taskFor(this.loadModels).perform(revisionId) as LoadModelsTask;
        const revisionManager = new RevisionManager(getOwner(this), loadModelsTask, revisionId);
        const navigationManager = new RevisionNavigationManager(revisionManager);
        return {
            navigationManager,
            revisionManager,
        };
    }


    @action
    willTransition(transition: Transition) {
        const { revisionManager } = this.controller.model;
        const draftIsDirty = revisionManager.onJustificationInput.isRunning ||
            revisionManager.onPageInput.isRunning ||
            revisionManager.saveWithToast.isRunning ||
            revisionManager.lastSaveFailed;
        if (!transition.to.name.includes(this.routeName) && draftIsDirty) {
            if (!window.confirm(this.intl.t('registries.edit_revision.save_before_exit'))) {
                transition.abort();
                taskFor(revisionManager.saveWithToast).perform();
            }
        }
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
