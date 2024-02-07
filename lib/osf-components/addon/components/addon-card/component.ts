import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

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

    @task
    @waitFor
    async disableAddon() {
        const { addon } = this.args;
        await taskFor(addon.disableProjectAddon).perform();
        this.closeDeleteModal();
    }

    get assetLogo() {
        return this.args.addon.provider.iconUri;
    }

    get addonIsConfigured() {
        return this.args.addon.configuredStorageAddon;
    }
}
