import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { OperationKwargs } from 'ember-osf-web/models/configured-addon';
import { Item, ListItemsResult } from 'ember-osf-web/models/addon-operation-invocation';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

interface Args {
    configuredAddon: ConfiguredAddonModel;
    defaultKwargs?: OperationKwargs;
    startingFolderId: string;
}

export default class FileManager extends Component<Args> {
    @service intl!: IntlService;
    @service toast!: Toast;

    @tracked currentPath: Item[] = [];
    @tracked currentItems: Item[] = [];
    @tracked currentFolderId?: string;

    @tracked cursor?: string;
    @tracked hasMore = false;

    private lastInvocation: any = null;

    get isLoading() {
        return taskFor(this.args.configuredAddon.getFolderItems).isRunning ||
            taskFor(this.getStartingFolder).isRunning;
    }

    get isError() {
        return taskFor(this.args.configuredAddon.getFolderItems).lastPerformed?.error ||
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
        this.cursor = undefined;
        this.currentPath = this.currentPath = [];
        this.currentFolderId = undefined;
        taskFor(this.getItems).perform();
    }

    @action
    goToFolder(folder: Item) {
        this.cursor = undefined;
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
        this.cursor = this.lastInvocation?.operationResult.nextSampleCursor;
        taskFor(this.getItems).perform();
    }


    @task
    @waitFor
    async getStartingFolder() {
        const { startingFolderId, configuredAddon } = this.args;
        try {
            if (startingFolderId) {
                const invocation = await taskFor(configuredAddon.getItemInfo).perform(startingFolderId);
                const result = invocation.operationResult as Item;
                this.currentFolderId = result.itemId;
                this.currentPath = result.itemPath ? [...result.itemPath] : [];
            }
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
            const getFolderArgs = !this.currentFolderId ? {} : kwargs;
            const invocation = await taskFor(this.args.configuredAddon.getFolderItems).perform(getFolderArgs);
            this.lastInvocation = invocation;
            const operationResult = invocation.operationResult as ListItemsResult;
            if (!this.currentFolderId) {
                this.currentFolderId = operationResult.items[0].itemId;
            }
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
