import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { Item, ListItemsResult } from 'ember-osf-web/models/addon-operation-invocation';
import ConfiguredStorageAddonModel, { OperationKwargs } from 'ember-osf-web/models/configured-storage-addon';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

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
    @tracked currentFolderId = '';

    @tracked cursor = '';
    @tracked hasMore = false;

    private lastInvocation: any = null;

    get isLoading() {
        return taskFor(this.args.configuredStorageAddon.getFolderItems).isRunning ||
            taskFor(this.getStartingFolder).isRunning;
    }

    get isError() {
        return taskFor(this.args.configuredStorageAddon.getFolderItems).lastPerformed?.error ||
            taskFor(this.getStartingFolder).lastPerformed?.error;
    }

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.initialize).perform();
    }

    @task
    @waitFor
    async initialize() {
        await taskFor(this.getStartingFolder).perform();
        await taskFor(this.getItems).perform();
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
        this.currentItems = [];
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
            const result = invocation.operationResult as Item;
            this.currentFolderId = result.itemId;
            this.currentPath = result.itemPath ? [...result.itemPath] : [];
        } catch (e) {
            captureException(e);
            const errorMessage = this.intl.t('osf-components.addons-service.file-manager.get-item-error');
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    }

    @task
    @waitFor
    async getItems() {
        const kwargs = this.args.defaultKwargs || {};
        kwargs.itemId = this.currentFolderId;
        kwargs.pageCursor = this.cursor;
        try {
            let invocation;
            if (!this.currentFolderId) {
                invocation = await taskFor(this.args.configuredStorageAddon.getFolderItems).perform();
            } else {
                invocation = await taskFor(this.args.configuredStorageAddon.getFolderItems).perform(kwargs);
            }
            this.lastInvocation = invocation;
            const operationResult = invocation.operationResult as ListItemsResult;
            this.currentItems = this.cursor ? [...this.currentItems, ...operationResult.items] : operationResult.items;
            this.hasMore = Boolean(operationResult.nextSampleCursor);
        } catch (e) {
            captureException(e);
            const errorMessage = this.intl.t('osf-components.addons-service.file-manager.get-items-error');
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    }
}
