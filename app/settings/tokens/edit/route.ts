import { action } from '@ember-decorators/object';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';

import SettingsTokensEditController from './controller';

export default class SettingsTokensEditRoute extends Route.extend({
    modelTask: task(function *(this: SettingsTokensEditRoute, id: string) {
        return yield this.store.findRecord('token', id, { reload: false });
    }),
}) {
    model(this: SettingsTokensEditRoute, params: { token_id: string }) {
        return {
            id: params.token_id,
            taskInstance: this.modelTask.perform(params.token_id),
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
