import { assert } from '@ember/debug';
import { action, notifyPropertyChange } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { restartableTask, task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import NodeModel from 'ember-osf-web/models/node';
import { FileSortKey } from 'ember-osf-web/packages/files/file';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';

interface Args {
    target: NodeModel;
}

export default class OsfStorageManager extends Component<Args> {
    @tracked storageProvider?: FileProviderModel;
    @tracked folderLineage: OsfStorageFile[] = [];
    @tracked displayItems: OsfStorageFile[] = [];
    @tracked filter = '';
    @tracked sort = FileSortKey.AscName;
    @tracked currentPage = 1;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert('@target must be provided', this.args.target);
        taskFor(this.getRootFolderItems).perform();
    }

    get rootFolder() {
        return this.folderLineage[0];
    }

    get currentFolder() {
        return this.folderLineage[this.folderLineage.length - 1];
    }

    get parentFolder() {
        return this.folderLineage[this.folderLineage.length - 2];
    }

    get hasMore() {
        if (this.currentFolder && this.currentFolder.totalFileCount) {
            return this.currentFolder.totalFileCount > this.displayItems.length;
        }
        return undefined;
    }

    @restartableTask
    @waitFor
    async getRootFolderItems() {
        await taskFor(this.getRootFolder).perform();
        await taskFor(this.getCurrentFolderItems).perform();
    }

    @restartableTask
    @waitFor
    async getRootFolder() {
        if (this.args.target) {
            const fileProviders = await this.args.target.files;
            this.storageProvider = fileProviders.findBy('name', 'osfstorage') as FileProviderModel;
            this.folderLineage.push(new OsfStorageFile(await this.storageProvider.rootFolder));
            notifyPropertyChange(this, 'folderLineage');
        }
    }

    @restartableTask
    @waitFor
    async getCurrentFolderItems() {
        if (this.currentFolder) {
            if(this.currentPage === 1){
                this.displayItems = [];
            }
            const items = await this.currentFolder.getFolderItems(this.currentPage, this.sort, this.filter);
            this.displayItems.push(...items);
            notifyPropertyChange(this, 'displayItems');
        }
    }

    @task
    @waitFor
    async goToFolder(folder: OsfStorageFile) {
        this.filter = '';
        const index = this.folderLineage.indexOf(folder);
        if (index >= 0) {
            this.folderLineage.splice(index + 1);
        } else {
            this.folderLineage.push(folder);
        }
        notifyPropertyChange(this, 'folderLineage');
        this.displayItems = [];
        this.currentPage = 1;
        taskFor(this.getCurrentFolderItems).perform();
    }

    @restartableTask
    @waitFor
    async changeFilter(filter: string) {
        await timeout(500);
        this.filter = filter;
        this.currentPage = 1;
        taskFor(this.getCurrentFolderItems).perform();
    }

    @action
    changeSort(sort: FileSortKey) {
        this.sort = sort;
        this.currentPage = 1;
        taskFor(this.getCurrentFolderItems).perform();
    }

    @action
    loadMore() {
        this.currentPage += 1;
        taskFor(this.getCurrentFolderItems).perform();
    }
}
