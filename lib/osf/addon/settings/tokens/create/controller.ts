import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsTokenCreateController extends Controller {
    @service analytics!: Analytics;
    @service router: any;

    @action
    onSave(token: Token) {
        this.router.transitionTo('osf.settings.tokens.edit', token.id);
    }
}
