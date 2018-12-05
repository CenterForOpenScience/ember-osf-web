import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Component from '@ember/component';
import RouterService from '@ember/routing/router-service';
import Toast from 'ember-toastr/services/toast';

import { requiredAction } from 'ember-osf-web/decorators/component';
import DeveloperApp from 'ember-osf-web/models/developer-app';

@tagName('') // No div
export default class DeveloperAppCard extends Component {
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;

    // Required arguments
    developerApp!: DeveloperApp;
    @requiredAction onDelete!: () => unknown;

    @action
    async delete() {
        // Not a task -- if this removes the component, still want to run the callback
        await this.developerApp.destroyRecord();
        this.toast.success(this.intl.t('settings.developer-apps.deleted'));
        this.onDelete();
    }
}
