import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import IntlService from 'ember-intl/services/intl';

import { Item, ItemType } from 'ember-osf-web/models/addon-operation-invocation';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';


interface Args {
    configuredStorageAddon: ConfiguredStorageAddonModel;
    onSave: (folder: Item) => void;
}

export default class RootFolderPicker extends Component<Args> {
    @service intl!: IntlService;

    @tracked selectedFolder = this.args.configuredStorageAddon.rootFolder;
    @tracked currentItems: Item[] = [];

    defaultKwargs = {
        itemType: ItemType.Folder,
    };

    get disableSave() {
        return this.selectedFolder === this.args.configuredStorageAddon.rootFolder;
    }

    @action
    selectFolder(folder: Item) {
        this.selectedFolder = folder.itemId;
    }

    @task
    @waitFor
    async save() {
        const { configuredStorageAddon } = this.args;
        configuredStorageAddon.rootFolder = this.selectedFolder;
        await configuredStorageAddon.save();
    }
}
