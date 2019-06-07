import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';

import { notFoundURL } from 'ember-osf-web/utils/clean-url';

export default class SettingsDeveloperAppsEditRoute extends Route.extend({
    modelTask: task(function *(this: SettingsDeveloperAppsEditRoute, id: string) {
        try {
            return yield this.store.findRecord('developer-app', id, { reload: false });
        } catch (e) {
            this.replaceWith('not-found', notFoundURL(this.router.currentURL));
            throw e;
        }
    }),
}) {
    @service router!: RouterService;

    // eslint-disable-next-line camelcase
    model(params: { developer_app_id: string }) {
        return {
            id: params.developer_app_id,
            taskInstance: this.modelTask.perform(params.developer_app_id),
        };
    }
}
