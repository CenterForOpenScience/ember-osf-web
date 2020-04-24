import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
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
    }

    @action
    async resetSecret() {
        if (this.developerApp) {
            this.set('shouldShowSecret', false);
            this.developerApp.set('clientSecret', null);
            await this.developerApp.save();
            this.toast.success(this.intl.t('settings.developer-apps.resetSecret.success'));
        }
    }
}
