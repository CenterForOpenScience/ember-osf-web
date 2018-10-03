import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import SettingsTokensEditController from './controller';

export default class SettingsTokensEditRoute extends Route.extend({
    modelTask: task(function *(this: SettingsTokensEditRoute, id: string) {
        try {
            return yield this.store.findRecord('token', id, { reload: false });
        } catch (e) {
            this.replaceWith('not-found', this.router.currentURL.slice(1));
            throw e;
        }
    }),
}) {
    @service router!: RouterService;
    @service store!: DS.Store;

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
