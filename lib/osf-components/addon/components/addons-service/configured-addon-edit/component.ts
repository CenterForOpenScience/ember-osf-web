import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { TaskInstance } from 'ember-concurrency';

import { Item, ItemType } from 'ember-osf-web/models/addon-operation-invocation';
import AuthorizedAccountModel from 'ember-osf-web/models/authorized-account';
import AuthorizedComputingAccountModel from 'ember-osf-web/models/authorized-computing-account';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';
import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';


interface Args {
    configuredAddon?: ConfiguredAddonModel;
    authorizedAccount?: AuthorizedAccountModel;
    onSave: TaskInstance<void>;
}

export default class ConfiguredAddonEdit extends Component<Args> {
    @tracked displayName = this.args.configuredAddon?.displayName || this.args.authorizedAccount?.displayName;
    @tracked selectedFolder = this.args.configuredAddon?.rootFolder;
    @tracked currentItems: Item[] = [];

    defaultKwargs = {
        itemType: ItemType.Folder,
    };

    get hasRootFolder() {
        return !(
            this.args.authorizedAccount instanceof AuthorizedComputingAccountModel
            ||
            this.args.configuredAddon instanceof ConfiguredComputingAddonModel
        );
    }

    get invalidDisplayName() {
        return !this.displayName || this.displayName?.trim().length === 0;
    }

    get disableSave() {
        return this.invalidDisplayName || this.args.onSave.isRunning || (this.hasRootFolder && !this.selectedFolder);
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
