import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { TaskInstance } from 'ember-concurrency';

import { Item, ItemType } from 'ember-osf-web/models/addon-operation-invocation';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';


interface Args {
    configuredAddon: ConfiguredAddonModel;
    onSave: TaskInstance<void>;
}

export default class ConfiguredAddonEdit extends Component<Args> {
    @tracked displayName = this.args.configuredAddon.displayName;
    @tracked selectedFolder = this.args.configuredAddon.rootFolder;
    @tracked currentItems: Item[] = [];

    defaultKwargs = {
        itemType: ItemType.Folder,
    };

    get invalidDisplayName() {
        return !this.displayName || this.displayName?.trim().length === 0;
    }

    get disableSave() {
        return !this.selectedFolder || this.invalidDisplayName || this.args.onSave.isRunning;
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
