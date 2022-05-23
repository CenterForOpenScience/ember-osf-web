import { assert } from '@ember/debug';
import { action, notifyPropertyChange } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { restartableTask, task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import { FileSortKey } from 'ember-osf-web/packages/files/file';
import File from 'ember-osf-web/packages/files/file';
import ProviderFile from 'ember-osf-web/packages/files/provider-file';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import CurrentUserService from 'ember-osf-web/services/current-user';

import BitbucketProviderFile from 'ember-osf-web/packages/files/bitbucket-provider-file';
import BoxProviderFile from 'ember-osf-web/packages/files/box-provider-file';
import DataverseProviderFile from 'ember-osf-web/packages/files/dataverse-provider-file';
import DropboxProviderFile from 'ember-osf-web/packages/files/dropbox-provider-file';
import FigshareProviderFile from 'ember-osf-web/packages/files/figshare-provider-file';
import GithubProviderFile from 'ember-osf-web/packages/files/github-provider-file';
import GitlabProviderFile from 'ember-osf-web/packages/files/gitlab-provider-file';
import GoogleDriveProviderFile from 'ember-osf-web/packages/files/google-drive-provider-file';
import OneDriveProviderFile from 'ember-osf-web/packages/files/one-drive-provider-file';
import OsfStorageProviderFile from 'ember-osf-web/packages/files/osf-storage-provider-file';
import OwnCloudProviderFile from 'ember-osf-web/packages/files/own-cloud-provider-file';
import S3ProviderFile from 'ember-osf-web/packages/files/s3-provider-file';

interface Args {
    provider: FileProviderModel;
}

export default class StorageManager extends Component<Args> {
    @service currentUser!: CurrentUserService;
    @service router!: RouterService;
    @service intl!: Intl;
    @service toast!: Toast;

    @tracked storageProvider?: FileProviderModel;
    @tracked folderLineage: Array<File | ProviderFile> = [];
    @tracked displayItems: File[] = [];
    @tracked filter = '';
    @tracked sort = FileSortKey.AscName;
    @tracked currentPage = 1;

    @tracked baseSelectedFile?: File;
    @tracked selectedFiles: File[] = [];

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert('@provider must be provided', this.args.provider);
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
        if (this.args.provider) {
            this.storageProvider = this.args.provider;
            const providerName = this.storageProvider.provider;
            switch (providerName) {
            case 'bitbucket':
                this.folderLineage.push(new BitbucketProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'box':
                this.folderLineage.push(new BoxProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'dataverse':
                this.folderLineage.push(new DataverseProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'dropbox':
                this.folderLineage.push(new DropboxProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'figshare':
                this.folderLineage.push(new FigshareProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'github':
                this.folderLineage.push(new GithubProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'gitlab':
                this.folderLineage.push(new GitlabProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'googledrive':
                this.folderLineage.push(new GoogleDriveProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'onedrive':
                this.folderLineage.push(new OneDriveProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'osfstorage':
                this.folderLineage.push(new OsfStorageProviderFile(this.currentUser, this.storageProvider));
                break;
            case 'owncloud':
                this.folderLineage.push(new OwnCloudProviderFile(this.currentUser, this.storageProvider));
                break;
            case 's3':
                this.folderLineage.push(new S3ProviderFile(this.currentUser, this.storageProvider));
                break;
            default:
                // This should only be hit in development when we haven't set up a provider properly.
                this.router.transitionTo('not-found');
            }
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
    async goToFolder(folder: File) {
        this.filter = '';
        const index = this.folderLineage.indexOf(folder);
        if (index >= 0) {
            this.folderLineage.splice(index + 1);
        } else {
            this.folderLineage.push(folder);
        }
        notifyPropertyChange(this, 'folderLineage');
        this.deselectFiles();
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

    @task
    @waitFor
    async createNewFolder(newFolderName: string) {
        try {
            await this.currentFolder.createFolder(newFolderName);
            this.reload();
        } catch (e) {
            const errorTitle = this.intl.t('osf-components.file-browser.create_folder.error_title');
            const errorDetail = e.status === 409 ? this.intl.t('osf-components.file-browser.create_folder.error_409')
                : this.intl.t('osf-components.file-browser.create_folder.error_generic');
            this.toast.error(errorDetail, errorTitle);
            throw e;
        }
    }

    @action
    reload() {
        this.displayItems = [];
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

    @action
    selectFile(file: File, event: PointerEvent) {
        if (document.getSelection()) {
            document.getSelection()!.removeAllRanges();
        }
        if (event.shiftKey && this.baseSelectedFile) {
            const fileIndex = this.displayItems.indexOf(file);
            const baseIndex = this.displayItems.indexOf(this.baseSelectedFile);
            const from = Math.min(fileIndex, baseIndex);
            const to = Math.max(fileIndex, baseIndex) + 1;
            this.selectedFiles = this.displayItems.slice(from, to);
        } else {
            this.baseSelectedFile = file;
            if (this.selectedFiles.includes(file)) {
                this.selectedFiles.removeObject(file);
            } else {
                this.selectedFiles.pushObject(file);
            }
        }
    }

    @action
    deselectFiles() {
        this.selectedFiles = [];
        this.baseSelectedFile = undefined;
    }
}
