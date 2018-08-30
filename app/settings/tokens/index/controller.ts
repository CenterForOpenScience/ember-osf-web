import { action } from '@ember-decorators/object';
import Controller from '@ember/controller';

import Token from 'ember-osf-web/models/token';

export default class SettingsTokensIndexController extends Controller {
    reloadList: boolean = false;

    @action
    async deleteToken(this: SettingsTokensIndexController, token: Token) {
        await token.destroyRecord();

        this.set('reloadList', true);
    }
}
