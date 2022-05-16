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
import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';
import OsfStorageProviderFile from 'ember-osf-web/packages/files/osf-storage-provider-file';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException from 'ember-osf-web/utils/capture-exception';

interface MoveFileModalArgs {
    isOpen: boolean;
    close: () => void;
    filesToMove: OsfStorageFile[]; // TODO: type
    manager: OsfStorageManager;
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

    @tracked startingFolder?: OsfStorageProviderFile | OsfStorageFile;
    @tracked currentFolder?: OsfStorageProviderFile | OsfStorageFile; // TODO: types for other providers
    @tracked filesList: Array<OsfStorageProviderFile | OsfStorageFile> = [];// TODO: types for other providers
    @tracked folderPage = 1;
    @tracked totalFiles? = 0;
    @tracked breadcrumbs: Array<OsfStorageProviderFile | OsfStorageFile> = []; // TODO: types for other providers

    @tracked fileMoveTasks: Array<TaskInstance<null>> = [];

    get itemList() {
        return [...this.childNodeList, ...this.filesList];
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

    get isDisabled() {
        const {currentFolder, currentNode } = this;
        const providerIsReadOnly = false; // this.args.manager.provider.isReadOnly;
        const invalidDestination = this.currentFolder === this.startingFolder;
        return !currentFolder || providerIsReadOnly || invalidDestination
            || !currentNode.userHasWritePermission || this.isMoving;
    }

    get isMoving() {
        return this.fileMoveTasks.length > 0;
    }

    get moveDone() {
        return this.isMoving && this.fileMoveTasks.every(moveTask => moveTask.isFinished);
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
        this.currentNode = await this.store.findRecord('node', id);
        this.childNodeList = [];
        this.childNodePage = 1;
        this.resetFolder();
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
            });
            fileList = fileList.map(
                // TODO: generalize for other providers
                fileProviderModel => new OsfStorageProviderFile(this.currentUser, fileProviderModel),
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
    updateFolder(file: OsfStorageProviderFile | OsfStorageFile) {
        this.resetNode();
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
        this.currentFolder = undefined;
        this.filesList = [];
        this.breadcrumbs = [];
        this.folderPage = 1;
        this.totalFiles = 0;
    }

    @task
    @waitFor
    async moveFile(file: OsfStorageFile, destinationNode: NodeModel, path: string, provider: string,
        options?: { conflict: string }) {
        await file.move(destinationNode, path, provider, options);
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
                taskFor(file.move).perform(currentNode, currentFolder.path, provider.name));
            this.fileMoveTasks = moveTasks;
            await allSettled(moveTasks);
        } catch (e) {
            captureException(e);
        }
    }

    @action
    retry(file: OsfStorageFile, index: number) {
        const { currentFolder, currentNode, breadcrumbs } = this;
        const newTaskInstance = taskFor(file.move).perform(
            currentNode, currentFolder!.path, breadcrumbs[0].name,
        );
        this.fileMoveTasks[index] = newTaskInstance;
        notifyPropertyChange(this, 'fileMoveTasks');
    }

    @action
    replace(file: OsfStorageFile, index: number) {
        const { currentFolder, currentNode, breadcrumbs } = this;
        const newTaskInstance = taskFor(file.move).perform(
            currentNode, currentFolder!.path, breadcrumbs[0].name, { conflict: 'replace' },
        );
        this.fileMoveTasks[index] = newTaskInstance;
        notifyPropertyChange(this, 'fileMoveTasks');
    }

    @action
    onOpen() {
        this.fileMoveTasks = [];
        this.resetFolder();
        this.currentNode = this.args.manager.targetNode! as NodeModel;
        this.currentFolder = this.args.manager.currentFolder;
        this.startingFolder = this.args.manager.currentFolder;
        this.breadcrumbs = [...this.args.manager.folderLineage];
        taskFor(this.loadFiles).perform();
    }

    @action
    onClose() {
        if (this.startingFolder) {
            this.args.manager.goToFolder(this.startingFolder);
        }
    }

    @action
    cancelMoves() {
        this.fileMoveTasks.forEach(moveTask => moveTask.cancel());
    }
}
