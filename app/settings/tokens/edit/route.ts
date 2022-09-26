import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import { notFoundURL } from 'ember-osf-web/utils/clean-url';

import SettingsTokensEditController from './controller';

export default class SettingsTokensEditRoute extends Route {
    @service router!: RouterService;

    @task
    @waitFor
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
}
