import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';


import { Item, ItemType } from 'ember-osf-web/models/addon-operation-invocation';
import AuthorizedAccountModel from 'ember-osf-web/models/authorized-account';
import AuthorizedCitationAccountModel from 'ember-osf-web/models/authorized-citation-account';
import AuthorizedComputingAccountModel from 'ember-osf-web/models/authorized-computing-account';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';
import ConfiguredCitationAddonModel from 'ember-osf-web/models/configured-citation-addon';
import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';


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
    @tracked isWBGoogleDrive = false;
    @tracked accountId!: string;

    originalName = this.displayName;
    originalRootFolder = this.selectedFolder;
    defaultKwargs: any = {};

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        if (this.args.configuredAddon) {
            if (this.args.configuredAddon instanceof ConfiguredStorageAddonModel) {
                taskFor(this.loadExternalStorageService).perform();
                this.defaultKwargs['itemType'] = ItemType.Folder;
            }
            if (this.args.configuredAddon instanceof ConfiguredCitationAddonModel) {
                this.defaultKwargs['filterItems'] = ItemType.Collection;
            }
        }
        if (this.args.authorizedAccount) {
            if (this.args.authorizedAccount instanceof AuthorizedStorageAccountModel) {
                taskFor(this.loadExternalStorageService).perform();
                this.defaultKwargs['itemType'] = ItemType.Folder;
            }
            if (this.args.authorizedAccount instanceof AuthorizedCitationAccountModel) {
                this.defaultKwargs['filterItems'] = ItemType.Collection;
            }
        }
    }

    /**
     * This is called only to authorize because the current implementation will throw an
     * error because the "root folder" is not yet set.
     */
    @task
    @waitFor
    async loadExternalStorageService() {
        let external!: ExternalStorageServiceModel;
        if (this.args.configuredAddon && this.args.configuredAddon instanceof ConfiguredStorageAddonModel) {
            const baseAccount = await this.args.configuredAddon.baseAccount;
            this.accountId = baseAccount?.id;
            external = await this.args.configuredAddon.externalStorageService;
        }
        if (this.args.authorizedAccount && this.args.authorizedAccount instanceof AuthorizedStorageAccountModel) {
            external = await this.args.authorizedAccount.externalStorageService;

            this.accountId =  this.args.authorizedAccount.id;
        }

        this.isWBGoogleDrive = external?.wbKey === 'googledrive';
    }

    get requiresRootFolder() {
        return !(
            this.args.authorizedAccount instanceof AuthorizedComputingAccountModel
            ||
            this.args.configuredAddon instanceof ConfiguredComputingAddonModel
        );
    }

    get isGoogleDrive(): boolean {
        return this.isWBGoogleDrive;
    }

    get displayFileManager(): boolean {
        return this.requiresRootFolder && !this.isGoogleDrive;
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
