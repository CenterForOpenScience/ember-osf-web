import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
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
