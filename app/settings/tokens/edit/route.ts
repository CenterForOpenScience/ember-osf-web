import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import Analytics from 'ember-osf-web/services/analytics';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';

import SettingsTokensEditController from './controller';

export default class SettingsTokensEditRoute extends Route {
    @service analytics!: Analytics;
    @service router!: RouterService;

    @task
    async modelTask(id: string) {
        try {
            return await this.store.findRecord('token', id, { reload: false });
        } catch (e) {
            this.replaceWith('not-found', notFoundURL(this.router.currentURL));
            throw e;
        }
    }

    // eslint-disable-next-line camelcase
    model(params: { token_id: string }) {
        return {
            id: params.token_id,
            taskInstance: taskFor(this.modelTask).perform(params.token_id),
        };
    }

    resetController(controller: SettingsTokensEditController, isExiting: boolean) {
        if (isExiting) {
            controller.clearTokenValue();
        }
    }

    @action
    refreshRoute() {
        this.refresh();
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
