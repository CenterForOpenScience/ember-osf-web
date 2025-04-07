import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { TaskInstance } from 'ember-concurrency';

import { Item, ItemType } from 'ember-osf-web/models/addon-operation-invocation';
import AuthorizedAccountModel from 'ember-osf-web/models/authorized-account';
import AuthorizedCitationAccountModel from 'ember-osf-web/models/authorized-citation-account';
import AuthorizedComputingAccountModel from 'ember-osf-web/models/authorized-computing-account';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';
import ConfiguredCitationAddonModel from 'ember-osf-web/models/configured-citation-addon';
import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';


interface Args {
    configuredAddon?: ConfiguredAddonModel;
    authorizedAccount?: AuthorizedAccountModel;
    onSave: TaskInstance<void>;
}

export default class ConfiguredAddonEdit extends Component<Args> {
    @tracked displayName = this.args.configuredAddon?.displayName || this.args.authorizedAccount?.displayName;
    @tracked selectedFolder = this.args.configuredAddon?.rootFolder;
    @tracked selectedFolderDisplayName = this.args.configuredAddon?.rootFolderName;
    @tracked currentItems: Item[] = [];

    originalName = this.displayName;
    originalRootFolder = this.selectedFolder;
    defaultKwargs: any = {};

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        if (this.args.configuredAddon) {
            if (this.args.configuredAddon instanceof ConfiguredStorageAddonModel) {
                this.defaultKwargs['itemType'] = ItemType.Folder;
            }
            if (this.args.configuredAddon instanceof ConfiguredCitationAddonModel) {
                this.defaultKwargs['filterItems'] = ItemType.Collection;
            }
        }
        if (this.args.authorizedAccount) {
            if (this.args.authorizedAccount instanceof AuthorizedStorageAccountModel) {
                this.defaultKwargs['itemType'] = ItemType.Folder;
            }
            if (this.args.authorizedAccount instanceof AuthorizedCitationAccountModel) {
                this.defaultKwargs['filterItems'] = ItemType.Collection;
            }
        }
    }

    get requiresRootFolder() {
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
        const displayNameUnchanged = this.displayName === this.originalName;
        const rootFolderUnchanged = this.requiresRootFolder && this.selectedFolder === this.originalRootFolder;
        const needsRootFolder = this.requiresRootFolder && !this.selectedFolder;

        if (this.invalidDisplayName || needsRootFolder) {
            return true;
        }
        return (rootFolderUnchanged && displayNameUnchanged) || this.args.onSave.isRunning;
    }

    get nameValid() {
        return !this.invalidDisplayName && this.displayName !== this.originalName;
    }

    get folderValid() {
        return !this.requiresRootFolder && this.selectedFolder && this.selectedFolder !== this.originalRootFolder;
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
        this.selectedFolderDisplayName = folder.itemName;
    }
}
