import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import Provider from 'ember-osf-web/packages/addons-service/provider';
import AddonsServiceManagerComponent from 'osf-components/components/addons-service/manager/component';

interface Args {
    addon: Provider;
    manager: AddonsServiceManagerComponent;
}

export default class AddonsCardComponent extends Component<Args> {
    @tracked deleteModalOpen = false;

    @action
    closeDeleteModal() {
        this.deleteModalOpen = false;
    }

    @action
    disableAddon() {
        const { addon } = this.args;
        addon.disableProjectAddon();
    }

    get assetLogo() {
        return this.args.addon.provider.iconUri;
    }

    get addonIsConfigured() {
        return this.args.addon.configuredStorageAddon;
    }
}
