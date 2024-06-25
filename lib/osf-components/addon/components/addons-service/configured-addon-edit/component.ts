import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { TaskInstance } from 'ember-concurrency';

import { Item, ItemType } from 'ember-osf-web/models/addon-operation-invocation';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';


interface Args {
    configuredStorageAddon: ConfiguredStorageAddonModel;
    onSave: TaskInstance<void>;
}

export default class ConfiguredAddonEdit extends Component<Args> {
    @tracked displayName = this.args.configuredStorageAddon.displayName;
    @tracked selectedFolder = this.args.configuredStorageAddon.rootFolder;
    @tracked currentItems: Item[] = [];

    defaultKwargs = {
        itemType: ItemType.Folder,
    };

    get invalidDisplayName() {
        return this.displayName.trim().length === 0;
    }

    get folderChanged() {
        return this.selectedFolder !== this.args.configuredStorageAddon.rootFolder;
    }

    get disableSave() {
        const folderValid = this.folderChanged;
        const nameValid = this.displayName !== this.args.configuredStorageAddon.displayName && !this.invalidDisplayName;
        return !(folderValid || nameValid) || this.args.onSave.isRunning;
    }

    get onSaveArgs() {
        return {
            displayName: this.displayName,
            rootFolder: this.selectedFolder,
        };
    }

    @action
    selectFolder(folder: Item) {
        this.selectedFolder = folder.itemId;
    }
}
