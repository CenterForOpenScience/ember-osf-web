import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';

export default class SettingsDeveloperAppsEditRoute extends Route.extend({
    modelTask: task(function *(this: SettingsDeveloperAppsEditRoute, id: string) {
        try {
            return yield this.store.findRecord('developer-app', id, { reload: false });
        } catch (e) {
            this.replaceWith('not-found', this.router.currentURL.slice(1));
            throw e;
        }
    }),
}) {
    @service router!: RouterService;

    model(params: { developer_app_id: string }) {
        return {
            id: params.developer_app_id,
            taskInstance: this.modelTask.perform(params.developer_app_id),
        };
    }
}
