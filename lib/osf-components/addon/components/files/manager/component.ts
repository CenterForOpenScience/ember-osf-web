import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import FileProvider from 'ember-osf-web/models/file-provider';
import Node from 'ember-osf-web/models/node';
import { PaginatedMeta } from 'osf-api';

import template from './template';

export interface FilesManager {
    loading: boolean;
    loadingFolderItems: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    canEdit: boolean;
    sort: string;
    inRootFolder: boolean;
    currentFolder: File;
    rootFolder: File;
    displayedItems: File[];
    fileProvider: FileProvider;
    goToFolder: (item: File) => void;
    goToParentFolder: (item: File) => void;
    onSelectFile?: (item: File) => void;
    addFile: (id: string) => void;
    sortItems: (sort: string) => void;
}

interface PromiseManyArrayWithMeta extends DS.PromiseManyArray<File> {
    meta: PaginatedMeta;
}

type SortKey = 'date_modified' | '-date_modified' | 'name' | '-name';

@tagName('')
@layout(template)
export default class FilesManagerComponent extends Component {
    @service intl!: Intl;
    @service store!: DS.Store;
    @service toast!: Toast;

    node!: Node;

    onAddFile?: (file: File) => void;

    fileProvider!: FileProvider;
    currentFolder!: File;
    lastUploaded: File[] = []; // Files uploaded since last sort.
    rootFolder!: File;
    pageSize = 10;
    sort: SortKey = 'date_modified';
    page = 1;

    @alias('node.userHasAdminPermission') canEdit!: boolean;
    @alias('getRootItems.isRunning') loading!: boolean;
    @alias('loadMore.isRunning') loadingMore!: boolean;
    @or(
        'sortFolderItems.isRunning',
        'getCurrentFolderItems.isRunning',
    ) loadingFolderItems!: boolean;

    @computed('currentFolder.files.[]', 'page')
    get maxFilesDisplayed() {
        if (this.currentFolder) {
            return this.page * this.pageSize;
        }
        return 0;
    }

    @computed('currentFolder')
    get inRootFolder() {
        const { currentFolder } = this;
        return !(currentFolder && currentFolder.belongsTo('parentFolder').id());
    }

    @computed('currentFolder.files.[]', 'page', 'sort', 'maxFilesDisplayed', 'lastUploaded')
    get displayedItems() {
        if (!this.currentFolder) {
            return [];
        }

        let sortedItems: File[] = this.currentFolder.files.toArray();

        if (this.sort) {
            const regex = /^(-?)([-\w]+)/;
            const groups = regex.exec(this.sort)!;

            groups.shift();
            const [reverse, sortKey] = groups.slice(0, 2);

            sortedItems = sortedItems.sortBy(camelize(sortKey));

            if (reverse) {
                sortedItems = sortedItems.reverse();
            }
            sortedItems = sortedItems.slice(0, this.maxFilesDisplayed);
        }

        return [
            ...this.lastUploaded,
            ...sortedItems.filter(item => !this.lastUploaded.includes(item)),
        ];
    }

    @computed('currentFolder.files.{[],meta.total}', 'displayedItems')
    get hasMore() {
        const { currentFolder, displayedItems } = this;

        if (currentFolder) {
            const currentFolderItems = currentFolder.files as PromiseManyArrayWithMeta;
            return currentFolderItems.meta && displayedItems.length < currentFolderItems.meta.total;
        }

        return false;
    }

    @task({ restartable: true, on: 'didReceiveAttrs' })
    getRootItems = task(function *(this: FilesManagerComponent) {
        assert('@node is required', Boolean(this.node));

        const fileProviders = yield this.node.files;
        const fileProvider = fileProviders.findBy('name', 'osfstorage') as FileProvider;
        const rootFolder = yield fileProvider.rootFolder;

        yield rootFolder.files;

        this.setProperties({
            fileProvider,
            rootFolder,
            currentFolder: rootFolder,
        });
    });

    @task
    loadMore = task(function *(this: FilesManagerComponent) {
        yield this.currentFolder.queryHasMany('files', {
            page: this.page + 1,
            pageSize: this.pageSize,
            sort: this.sort,
        });

        this.incrementProperty('page');
    });

    @task
    getCurrentFolderItems = task(function *(this: FilesManagerComponent, targetFolder: File) {
        this.set('currentFolder', targetFolder);

        yield this.currentFolder.files;
    });

    @task
    sortFolderItems = task(function *(this: FilesManagerComponent) {
        yield this.currentFolder.queryHasMany('files', {
            pageSize: this.pageSize,
            sort: this.sort,
            page: 1,
        });
        this.setProperties({ lastUploaded: [] });
    });

    @task
    addFile = task(function *(this: FilesManagerComponent, id: string) {
        const duplicate = this.currentFolder.files.findBy('id', id);
        const file = yield this.store
            .findRecord(
                'file',
                id,
                duplicate ? {} : { adapterOptions: { query: { create_guid: 1 } } },
            );

        if (duplicate) {
            this.currentFolder.files.removeObject(duplicate);
        }

        this.currentFolder.files.pushObject(file);

        if (duplicate) {
            return;
        }

        this.lastUploaded.pushObject(file);

        this.toast.success(this.intl.t('file_browser.file_added_toast'));
        if (this.onAddFile) {
            this.onAddFile(file);
        }
    });

    @action
    goToParentFolder(currentFolder: File) {
        this.setProperties({ lastUploaded: [] });
        this.setProperties({ currentFolder: currentFolder.hasMany('parentFolder').value() });
    }

    @action
    goToFolder(targetFolder: File) {
        this.setProperties({ lastUploaded: [] });
        const folderItems = targetFolder.hasMany('files').value();

        if (folderItems === null) {
            this.getCurrentFolderItems.perform(targetFolder);
        } else {
            this.setProperties({ currentFolder: targetFolder });
        }
    }

    @action
    sortItems(sort: string) {
        this.setProperties({ sort });

        this.sortFolderItems.perform();
    }
}
