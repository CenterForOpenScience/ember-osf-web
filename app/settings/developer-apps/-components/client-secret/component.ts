import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import RouterService from '@ember/routing/router-service';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import DeveloperApp from 'ember-osf-web/models/developer-app';
import Analytics from 'ember-osf-web/services/analytics';

@tagName('') // No div
export default class DeveloperAppClientSecret extends Component {
    // Required arguments
    developerApp?: DeveloperApp;

    // Private properties
    @service analytics!: Analytics;
    @service i18n!: I18n;
    @service router!: RouterService;
    @service toast!: Toast;

    shouldShowSecret: boolean = false;

    @action
    toggleShowSecret() {
        this.toggleProperty('shouldShowSecret');
    }

    @action
    async resetSecret() {
        if (this.developerApp) {
            this.set('shouldShowSecret', false);
            // TODO (EMB-407) When the API is updated, PATCH `clientSecret` to `null`
            await this.developerApp.resetSecret();
            this.toast.success(this.i18n.t('settings.developer-apps.resetSecret.success'));
        }
    }
}
