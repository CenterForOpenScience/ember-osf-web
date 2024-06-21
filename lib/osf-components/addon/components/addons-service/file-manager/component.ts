import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { Item } from 'ember-osf-web/models/addon-operation-invocation';
import ConfiguredStorageAddonModel, { OperationKwargs } from 'ember-osf-web/models/configured-storage-addon';

interface Args {
    configuredStorageAddon: ConfiguredStorageAddonModel;
    defaultKwargs?: OperationKwargs;
    startingFolderId: string;
}

export default class FileManager extends Component<Args> {
    @service intl!: IntlService;
    @service toast!: Toast;

    @tracked currentPath: Item[] = [];
    @tracked currentItems: Item[] = [];
    @tracked currentFolderId = this.args.startingFolderId;

    @tracked cursor = '';
    @tracked hasMore = false;

    private lastInvocation: any = null;

    get isLoading() {
        return taskFor(this.args.configuredStorageAddon.getFolderItems).isRunning;
    }

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.getStartingFolder).perform();
        taskFor(this.getItems).perform();
    }


    @action
    goToRoot() {
        this.cursor = '';
        this.currentPath = this.currentPath.slice(0, 1);
        this.currentFolderId = this.args.startingFolderId;
        taskFor(this.getItems).perform();
    }

    @action
    goToFolder(folder: Item) {
        this.cursor = '';
        if (this.currentPath.includes(folder)) {
            this.currentPath = this.currentPath.slice(0, this.currentPath.indexOf(folder) + 1);
        } else {
            this.currentPath = [...this.currentPath, folder];
        }
        this.currentFolderId = folder.itemId;
        taskFor(this.getItems).perform();
    }

    @action
    getMore() {
        this.cursor = this.lastInvocation?.operationResult.cursor;
        taskFor(this.getItems).perform();
    }


    @task
    @waitFor
    async getStartingFolder() {
        const { startingFolderId, configuredStorageAddon } = this.args;
        try {
            const invocation = await taskFor(configuredStorageAddon.getItemInfo).perform(startingFolderId);
            this.currentPath = invocation.operationResult.items;
        } catch (e) {
            this.toast.error(this.intl.t('osf-components.addons-service.file-manager.get-item-error'));
        }
    }

    @task
    @waitFor
    async getItems() {
        const kwargs = this.args.defaultKwargs || {};
        kwargs.itemId = this.currentFolderId;
        kwargs.pageCursor = this.cursor;
        try {
            const invocation = await taskFor(this.args.configuredStorageAddon.getFolderItems).perform(kwargs);
            this.lastInvocation = invocation;
            const { operationResult } = invocation;
            this.currentItems = this.cursor ? [...this.currentItems, ...operationResult.items] : operationResult.items;
            this.hasMore = Boolean(invocation.operationResult.cursor);
        } catch (e) {
            this.toast.error(this.intl.t('osf-components.addons-service.file-manager.get-items-error'));
        }
    }
}
