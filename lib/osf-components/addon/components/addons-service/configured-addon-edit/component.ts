import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { TaskInstance } from 'ember-concurrency';

import { Item, ItemType } from 'ember-osf-web/models/addon-operation-invocation';
import AuthorizedAccountModel from 'ember-osf-web/models/authorized-account';
import AuthorizedCitationAccountModel from 'ember-osf-web/models/authorized-citation-account';
import AuthorizedComputingAccountModel from 'ember-osf-web/models/authorized-computing-account';
import AuthorizedLinkAccountModel from 'ember-osf-web/models/authorized-link-account';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';
import ConfiguredCitationAddonModel from 'ember-osf-web/models/configured-citation-addon';
import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';
import ConfiguredLinkAddonModel from 'ember-osf-web/models/configured-link-addon';
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
    @tracked selectedItem = '';
    @tracked selectedItemDisplayName = '';
    @tracked selectedResourceType = '';
    originalName = this.displayName;
    originalRootFolder = this.selectedFolder;
    originalSelectedItem = this.selectedItem;
    originalResourceType = this.selectedResourceType;

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
            if (this.args.configuredAddon instanceof ConfiguredLinkAddonModel) {
                this.selectedItem = (this.args.configuredAddon as ConfiguredLinkAddonModel).targetId;
                this.selectedItemDisplayName = (this.args.configuredAddon as ConfiguredLinkAddonModel).targetItemName;
                this.selectedResourceType = (this.args.configuredAddon as ConfiguredLinkAddonModel).resourceType;
            }
        }
        if (this.args.authorizedAccount) {
            if (this.args.authorizedAccount instanceof AuthorizedStorageAccountModel) {
                this.defaultKwargs['itemType'] = ItemType.Folder;
            }
            if (this.args.authorizedAccount instanceof AuthorizedCitationAccountModel) {
                this.defaultKwargs['filterItems'] = ItemType.Collection;
            }
            if (this.args.authorizedAccount instanceof AuthorizedLinkAccountModel) {
                // noop
            }
        }
    }

    get isLinkAddon() {
        return this.args.configuredAddon instanceof ConfiguredLinkAddonModel ||
            this.args.authorizedAccount instanceof AuthorizedLinkAccountModel;
    }

    get requiresFilesWidget() {
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
        const rootFolderUnchanged = this.requiresFilesWidget && !this.isLinkAddon
            && this.selectedFolder === this.originalRootFolder;
        const targetIdUnchanged = this.isLinkAddon && this.originalSelectedItem === this.selectedItem;
        const resourceTypeUnchanged = this.originalResourceType === this.selectedResourceType;
        const needsResourceType = this.isLinkAddon && !this.selectedResourceType;
        const needsTargetId = this.isLinkAddon && !this.selectedItem;
        const needsRootFolder = this.requiresFilesWidget && !this.isLinkAddon && !this.selectedFolder;

        if (this.invalidDisplayName || needsRootFolder || needsResourceType || needsTargetId) {
            return true;
        }
        if (this.isLinkAddon) {
            return targetIdUnchanged && resourceTypeUnchanged || this.args.onSave.isRunning;
        }
        return (rootFolderUnchanged && displayNameUnchanged) || this.args.onSave.isRunning;
    }

    get onSaveArgs() {
        return {
            displayName: this.displayName,
            rootFolder: this.selectedFolder,
            targetId: this.selectedItem,
            resourceType: this.selectedResourceType,
        };
    }

    @action
    selectItem(item: Item) {
        if (this.isLinkAddon) {
            this.selectedItem = item.itemId;
            this.selectedItemDisplayName = item.itemName;
        } else {
            this.selectedFolder = item.itemId;
            this.selectedFolderDisplayName = item.itemName;
        }
    }
}
