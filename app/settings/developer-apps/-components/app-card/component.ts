import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import RouterService from '@ember/routing/router-service';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { requiredAction } from 'ember-osf-web/decorators/component';
import DeveloperApp from 'ember-osf-web/models/developer-app';

@tagName('') // No div
export default class DeveloperAppCard extends Component {
    @service i18n!: I18n;
    @service router!: RouterService;
    @service toast!: Toast;

    // Required arguments
    developerApp!: DeveloperApp;
    @requiredAction onDelete!: () => unknown;

    @action
    async delete() {
        // Not a task -- if this removes the component, still want to run the callback
        await this.developerApp.destroyRecord();
        this.toast.success(this.i18n.t('settings.developer-apps.deleted'));
        this.onDelete();
    }
}
