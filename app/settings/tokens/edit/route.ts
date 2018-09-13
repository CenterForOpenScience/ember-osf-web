import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';

import SettingsTokensEditController from './controller';

export default class SettingsTokensEditRoute extends Route {
    modelTask = task(function *(this: SettingsTokensEditRoute, id: string) {
        const token = yield this.store.findRecord('token', id, { reload: false });

        // The tokenId should be displayed only once
        const { tokenId } = token;
        if (tokenId) {
            token.set('tokenId', null);
        }

        return { token, tokenId };
    });

    model(this: SettingsTokensEditRoute, params: { token_id: string }) {
        return {
            id: params.token_id,
            taskInstance: this.get('modelTask').perform(params.token_id),
        };
    }

    resetController(controller: SettingsTokensEditController, isExiting: boolean) {
        if (isExiting) {
            controller.clearTokenId();
        }
    }
}
