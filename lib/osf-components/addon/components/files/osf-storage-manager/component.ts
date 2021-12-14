import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { restartableTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import FileModel from 'ember-osf-web/models/file';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import NodeModel from 'ember-osf-web/models/node';

interface Args {
    node: NodeModel;
}

type SortKey = 'date_modified' | '-date_modified' | 'name' | '-name';

export default class OsfStorageManager extends Component<Args> {
    @tracked osfStorageProvider?: FileProviderModel;
    @tracked rootFolder?: FileModel;
    @tracked currentFolder?: FileModel;
    @tracked currentFolderItems: FileModel[] = [];
    @tracked filter?: string;
    @tracked sort?: SortKey;
    @tracked currentPage = 1;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert('@node must be provided', this.args.node);
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
        if (this.args.node) {
            const fileProviders = await this.args.node.files;
            this.osfStorageProvider = fileProviders.findBy('name', 'osfstorage') as FileProviderModel;
            this.rootFolder = await this.osfStorageProvider.rootFolder;
            this.currentFolder = this.rootFolder;
        }
    }

    @restartableTask
    @waitFor
    async getCurrentFolderItems() {
        if (this.currentFolder) {
            const queryResult = await this.currentFolder.queryHasMany('files',
                {
                    page: this.currentPage,
                    sort: this.sort,
                    filter: this.filter,
                });
            this.currentFolderItems.push(...queryResult);
        }
    }

    @task
    @waitFor
    async addFile() {
        //
    }

    @task
    @waitFor
    async deleteFile(file: FileModel) {
        await file.destroyRecord();
    }

    @task
    @waitFor
    async goToFolder(folder: FileModel) {
        this.currentFolderItems = [];
        this.currentFolder = folder;
        await taskFor(this.getCurrentFolderItems).perform();
    }

    @task
    @waitFor
    async goToParentFolder() {
        if (this.currentFolder) {
            await taskFor(this.goToFolder).perform(this.currentFolder?.parentFolder);
        }
    }

    @action
    changeFilter(filter: string) {
        this.filter = filter;
        this.currentPage = 1;
    }

    @action
    changeSort(sort: string) {
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
