import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import { action, notifyPropertyChange } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { allSettled, task, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import NodeModel from 'ember-osf-web/models/node';
import { FileSortKey } from 'ember-osf-web/packages/files/file';
import StorageManager, { getStorageProviderFile }
    from 'osf-components/components/storage-provider-manager/storage-manager/component';
import File from 'ember-osf-web/packages/files/file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException from 'ember-osf-web/utils/capture-exception';

interface MoveFileModalArgs {
    isOpen: boolean;
    close: () => void;
    preserveOriginal?: boolean;
    filesToMove: File[]; // or copy
    manager: StorageManager;
}

export default class MoveFileModalComponent extends Component<MoveFileModalArgs> {
    @service store!: Store;
    @service currentUser!: CurrentUserService;
    @service intl!: Intl;
    @service toast!: Toast;

    @tracked currentNode!: NodeModel;
    @tracked childNodeList: NodeModel[] = [];
    @tracked childNodePage = 1;
    @tracked totalChildNodes = 0;

    @tracked startingFolder?: ProviderFile | File;
    @tracked currentFolder?: ProviderFile | File;
    @tracked filesList: Array<ProviderFile | File> = [];
    @tracked folderPage = 1;
    @tracked totalFiles? = 0;
    @tracked breadcrumbs: Array<ProviderFile | File> = [];

    @tracked fileActionTasks: Array<TaskInstance<null>> = [];

    get itemList() {
        return [...this.filesList, ...this.childNodeList];
    }

    get hasMore() {
        return this.hasMoreNodes || this.hasMoreFiles;
    }

    get hasMoreNodes() {
        if (this.currentNode && this.totalChildNodes) {
            return this.totalChildNodes > this.childNodeList.length;
        }
        return false;
    }

    get hasMoreFiles() {
        if (this.currentFolder && this.totalFiles) {
            return this.totalFiles > this.filesList.length;
        }
        return false;
    }

    get isLoading() {
        return taskFor(this.loadChildNodes).isRunning || taskFor(this.loadFiles).isRunning;
    }

    get providerIsReadOnly() {
        return this.currentFolder ? !this.currentFolder.userCanMoveToHere : true;
    }

    get isDisabled() {
        const { currentFolder, currentNode, breadcrumbs } = this;
        if (!currentFolder || !currentNode || breadcrumbs.length === 0) {
            return true;
        }
        const invalidDestination = currentFolder.id === this.startingFolder!.id;
        return this.providerIsReadOnly || invalidDestination
            || !currentNode.userHasWritePermission || this.isMovingOrCopying;
    }

    get isMovingOrCopying() {
        return this.fileActionTasks.length > 0;
    }

    get moveOrCopyDone() {
        return this.isMovingOrCopying && this.fileActionTasks.every(moveOrCopyTask => moveOrCopyTask.isFinished);
    }

    @task
    @waitFor
    async loadChildNodes() {
        const childrenList = await this.currentNode!.queryHasMany('children',
            {
                page: this.childNodePage,
            });
        this.totalChildNodes = childrenList.meta.total;
        this.childNodeList.push(...childrenList);
        notifyPropertyChange(this, 'childNodeList');
    }

    @task
    @waitFor
    async changeNode(id: string) {
        taskFor(this.loadChildNodes).cancelAll();
        this.resetFolder();
        this.currentNode = await this.store.findRecord('node', id);
        this.childNodeList = [];
        this.childNodePage = 1;
        taskFor(this.loadChildNodes).perform();
        taskFor(this.loadFiles).perform();
    }

    @task
    @waitFor
    async loadFiles() {
        let fileList;
        if (!this.currentFolder) {
            fileList = await this.currentNode!.queryHasMany('files', {
                page: this.folderPage,
                'page[size]': 20,
            });
            fileList = fileList.map(
                fileProviderModel => getStorageProviderFile(this.currentUser, fileProviderModel),
            );
        } else {
            fileList = await this.currentFolder.getFolderItems(this.folderPage, FileSortKey.AscName, '');
        }
        this.totalFiles = this.currentFolder?.totalFileCount;
        this.filesList.push(...fileList);
        notifyPropertyChange(this, 'filesList');
    }

    constructor(owner: unknown, args: MoveFileModalArgs) {
        super(owner, args);
        assert('MoveFileModalComponent needs a targetNode', this.args.manager.targetNode);
    }


    @action
    loadMore() {
        if (this.hasMoreNodes) {
            this.loadMoreChildNodes();
        }
        if (this.hasMoreFiles) {
            this.loadMoreFiles();
        }
    }

    @action
    updateNode(node: { id: string, title: string }) {
        taskFor(this.changeNode).perform(node.id);
    }

    @action
    loadMoreChildNodes() {
        this.childNodePage += 1;
        taskFor(this.loadChildNodes).perform();
    }

    @action
    resetNode() {
        this.childNodeList = [];
        this.childNodePage = 1;
        this.totalChildNodes = 0;
    }

    @action
    updateFolder(file: ProviderFile | File) {
        this.resetNode();
        taskFor(this.loadFiles).cancelAll();
        this.currentFolder = file;
        this.filesList = [];
        this.folderPage = 1;
        const index = this.breadcrumbs.indexOf(file);
        if (index >= 0) {
            this.breadcrumbs.splice(index + 1);
        } else {
            this.breadcrumbs.push(file);
        }
        notifyPropertyChange(this, 'breadcrumbs');
        taskFor(this.loadFiles).perform();
    }

    @action
    loadMoreFiles() {
        this.folderPage += 1;
        taskFor(this.loadFiles).perform();
    }

    @action
    resetFolder() {
        taskFor(this.loadFiles).cancelAll();
        this.currentFolder = undefined;
        this.filesList = [];
        this.breadcrumbs = [];
        this.folderPage = 1;
        this.totalFiles = 0;
    }

    @task({ maxConcurrency: 1, enqueue: true })
    @waitFor
    async moveFile(file: File, destinationNode: NodeModel, path: string, provider: string,
        options?: { conflict: string }) {
        return await taskFor(file.move).perform(destinationNode, path, provider, options);
    }

    @task
    @waitFor
    async move() {
        const { currentFolder, currentNode, breadcrumbs } = this;
        if (!currentFolder || !currentNode || breadcrumbs.length === 0) {
            return;
        }
        const provider = breadcrumbs[0];
        try {
            const moveTasks = this.args.filesToMove.map(file =>
                taskFor(this.moveFile).perform(file, currentNode, currentFolder.path, provider.name));
            this.fileActionTasks = moveTasks;
            await allSettled(moveTasks);
        } catch (e) {
            captureException(e);
        }
    }

    @task({ maxConcurrency: 1, enqueue: true })
    @waitFor
    async copyFile(file: File, destinationNode: NodeModel, path: string, provider: string,
        options?: { conflict: string }) {
        return await taskFor(file.copy).perform(destinationNode, path, provider, options);
    }

    @task
    @waitFor
    async copy() {
        const { currentFolder, currentNode, breadcrumbs } = this;
        if (!currentFolder || !currentNode || breadcrumbs.length === 0) {
            return;
        }
        const provider = breadcrumbs[0];
        try {
            const copyTasks = this.args.filesToMove.map(file =>
                taskFor(this.copyFile).perform(file, currentNode, currentFolder.path, provider.name));
            this.fileActionTasks = copyTasks;
            await allSettled(copyTasks);
        } catch (e) {
            captureException(e);
        }
    }

    @action
    skip(index: number) {
        this.fileActionTasks.splice(index, 1);
        notifyPropertyChange(this, 'fileActionTasks');
    }

    @action
    retry(file: File, index: number) {
        const { currentFolder, currentNode, breadcrumbs } = this;
        const fileActionTask = this.args.preserveOriginal ? this.copyFile : this.moveFile;
        const newTaskInstance = taskFor(fileActionTask).perform(
            file, currentNode, currentFolder!.path, breadcrumbs[0].name,
        );
        this.fileActionTasks[index] = newTaskInstance;
        notifyPropertyChange(this, 'fileActionTasks');
    }

    @action
    replace(file: File, index: number) {
        const { currentFolder, currentNode, breadcrumbs } = this;
        const fileActionTask = this.args.preserveOriginal ? this.copyFile : this.moveFile;
        const newTaskInstance = taskFor(fileActionTask).perform(
            file, currentNode, currentFolder!.path, breadcrumbs[0].name, { conflict: 'replace' },
        );
        this.fileActionTasks[index] = newTaskInstance;
        notifyPropertyChange(this, 'fileActionTasks');
    }

    @action
    onOpen() {
        this.fileActionTasks = [];
        this.resetFolder();
        this.currentNode = this.args.manager.targetNode! as NodeModel;
        this.currentFolder = this.args.manager.currentFolder;
        this.startingFolder = this.args.manager.currentFolder;
        this.breadcrumbs = [...this.args.manager.folderLineage];
        taskFor(this.loadFiles).perform();
    }

    @action
    onClose() {
        if (this.startingFolder && this.fileActionTasks.length > 0) {
            this.cancelMoves();
            this.args.manager.reload();
        }
        this.args.close();
    }

    @action
    cancelMoves() {
        taskFor(this.move).cancelAll();
        taskFor(this.copy).cancelAll();
    }
}
