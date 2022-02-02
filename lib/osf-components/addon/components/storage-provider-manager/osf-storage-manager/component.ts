import { assert } from '@ember/debug';
import { action, notifyPropertyChange } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { restartableTask, task } from 'ember-concurrency';
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
    @tracked rootFolder?: OsfStorageFile;
    @tracked currentFolder?: OsfStorageFile;
    @tracked displayItems: OsfStorageFile[] = [];
    @tracked filter = '';
    @tracked sort = FileSortKey.AscDateModified;
    @tracked currentPage = 1;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert('@target must be provided', this.args.target);
        taskFor(this.getRootFolderItems).perform();
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
            this.rootFolder = new OsfStorageFile(await this.storageProvider.rootFolder);
            this.currentFolder = this.rootFolder;
        }
    }

    @restartableTask
    @waitFor
    async getCurrentFolderItems() {
        if (this.currentFolder) {
            const items = await this.currentFolder.getFolderItems(this.currentPage, this.sort, this.filter);
            this.displayItems.push(...items);
            notifyPropertyChange(this, 'displayItems');
        }
    }

    @task
    @waitFor
    async goToFolder(folder: OsfStorageFile) {
        this.displayItems = [];
        this.currentFolder = folder;
        this.currentPage = 1;
    }

    @task
    @waitFor
    async goToParentFolder() {
        if (this.currentFolder) {
            const parentFolder = new OsfStorageFile(await this.currentFolder.fileModel.parentFolder);
            await taskFor(this.goToFolder).perform(parentFolder);
        }
    }

    @action
    changeFilter(filter: string) {
        this.filter = filter;
        this.currentPage = 1;
    }

    @action
    changeSort(sort: FileSortKey) {
        this.sort = sort;
        this.currentPage = 1;
    }

    @action
    onPageChange() {
        taskFor(this.getCurrentFolderItems).perform();
    }

    @action
    loadMore() {
        this.currentPage += 1;
    }

}
