import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

import { notFoundURL } from 'ember-osf-web/utils/clean-url';

export default class SettingsDeveloperAppsEditRoute extends Route {
    @service router!: RouterService;

    @task({ withTestWaiter: true })
    modelTask = task(function *(this: SettingsDeveloperAppsEditRoute, id: string) {
        try {
            return yield this.store.findRecord('developer-app', id, { reload: false });
        } catch (e) {
            this.replaceWith('not-found', notFoundURL(this.router.currentURL));
            throw e;
        }
    });

    // eslint-disable-next-line camelcase
    model(params: { developer_app_id: string }) {
        return {
            id: params.developer_app_id,
            taskInstance: this.modelTask.perform(params.developer_app_id),
        };
    }
}
