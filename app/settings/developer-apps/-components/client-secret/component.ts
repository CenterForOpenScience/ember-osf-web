import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Component from '@ember/component';
import RouterService from '@ember/routing/router-service';
import Toast from 'ember-toastr/services/toast';

import DeveloperApp from 'ember-osf-web/models/developer-app';
import Analytics from 'ember-osf-web/services/analytics';

@tagName('') // No div
export default class DeveloperAppClientSecret extends Component {
    // Required arguments
    developerApp?: DeveloperApp;

    // Private properties
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;

    shouldShowSecret: boolean = false;

    @action
    toggleShowSecret() {
        this.toggleProperty('shouldShowSecret');
        this.analytics.click('button', 'Settings - Developer apps - Toggle client secret');
    }

    @action
    async resetSecret() {
        if (this.developerApp) {
            this.set('shouldShowSecret', false);
            // TODO (EMB-407) When the API is updated, PATCH `clientSecret` to `null`
            await this.developerApp.resetSecret();
            this.toast.success(this.intl.t('settings.developer-apps.resetSecret.success'));
        }
    }
}
