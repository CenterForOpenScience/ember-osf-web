import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { Item, ListItemsResult, OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';
import AuthorizedAccountModel from 'ember-osf-web/models/authorized-account';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import ConfiguredLinkAddonModel from 'ember-osf-web/models/configured-link-addon';

interface Args {
    configuredAddon?: ConfiguredAddonModel;
    authorizedAccount?: AuthorizedAccountModel;
    defaultKwargs?: OperationKwargs;
    startingFolderId: string;
}

export default class FileManager extends Component<Args> {
    @service intl!: IntlService;
    @service toast!: Toast;

    @tracked operationInvocableModel!: ConfiguredAddonModel | AuthorizedAccountModel;

    @tracked currentPath: Item[] = [];
    @tracked currentItems: Item[] = [];
    @tracked currentFolderId?: string;

    @tracked cursor?: string;
    @tracked hasMore = false;

    private lastInvocation: any = null;

    get isLoading() {
        return taskFor(this.operationInvocableModel.getFolderItems).isRunning ||
            taskFor(this.getStartingFolder).isRunning;
    }

    get isError() {
        return taskFor(this.operationInvocableModel.getFolderItems).lastPerformed?.error ||
            taskFor(this.getStartingFolder).lastPerformed?.error;
    }

    get isLinkAddon() {
        return this.operationInvocableModel instanceof ConfiguredLinkAddonModel;
    }

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert('Must provide a configuredAddon or authorizedAccount', args.configuredAddon || args.authorizedAccount);
        this.operationInvocableModel = (args.configuredAddon || args.authorizedAccount)!;
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
        const { startingFolderId } = this.args;
        try {
            if (startingFolderId) {
                const invocation = await taskFor(this.operationInvocableModel.getItemInfo).perform(startingFolderId);
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
        const kwargs = !this.currentFolderId ? {} : this.args.defaultKwargs || {};
        kwargs.itemId = this.currentFolderId;
        kwargs.pageCursor = this.cursor;
        try {
            const getFolderArgs = Object.fromEntries(
                Object.entries(kwargs).filter(([_, v]) => v !== null && v !== undefined),
            );
            const invocation = await taskFor(this.operationInvocableModel.getFolderItems).perform(getFolderArgs);
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
