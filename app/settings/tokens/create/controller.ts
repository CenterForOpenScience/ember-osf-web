import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

import Token from 'ember-osf-web/models/token';

export default class SettingsTokenCreateController extends Controller {
    @service router: any;

    @action
    onSave(token: Token) {
        this.router.transitionTo('settings.tokens.edit', token.id);
    }
}
