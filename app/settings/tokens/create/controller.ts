import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsTokenCreateController extends Controller {
    @service router: any;
    @service analytics!: Analytics;

    @action
    onSave(token: Token) {
        this.router.transitionTo('settings.tokens.edit', token.id);
    }
}
