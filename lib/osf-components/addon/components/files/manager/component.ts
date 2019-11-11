import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import FileProvider from 'ember-osf-web/models/file-provider';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import { PaginatedMeta } from 'osf-api';

import template from './template';

export interface FilesManager {
    loading: boolean;
    loadingFolderItems: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    canEdit: boolean;
    currentFolder: File;
    rootFolder: File;
    displayedItems: File[];
    goToFolder: (item: File) => void;
    goToParentFolder: (item: File) => void;
    onSelectFile?: (item: File) => void;
    addFile: (id: string) => void;
    sortFolderItems: (sort: string) => void;
}

interface PromiseManyArrayWithMeta extends DS.PromiseManyArray<File> {
    meta: PaginatedMeta;
}

@tagName('')
@layout(template)
export default class FilesManagerComponent extends Component.extend({
    getRootItems: task(function *(this: FilesManagerComponent) {
        assert('@node is required', Boolean(this.node));

        const fileProviders = yield this.node.files;
        const fileProvider = fileProviders.firstObject as FileProvider;
        const rootFolder = yield fileProvider.rootFolder;

        yield rootFolder.files;

        this.setProperties({
            rootFolder,
            currentFolder: rootFolder,
        });
    }).on('didReceiveAttrs').restartable(),
    loadMore: task(function *(this: FilesManagerComponent) {
        const { currentFolder } = this;
        const items = currentFolder.files;

        const atPage = Math.ceil((items.length as number) / this.pageSize);
        const moreItems = yield currentFolder.queryHasMany('files', {
            page: atPage + 1,
            pageSize: this.pageSize,
        });

        items.pushObjects([...moreItems]);
    }),

    getCurrentFolderItems: task(function *(this: FilesManagerComponent, targetFolder: File) {
        this.set('currentFolder', targetFolder);

        yield this.currentFolder.files;
    }),

    sortFolderItems: task(function *(this: FilesManagerComponent, sort: string) {
        yield this.currentFolder.queryHasMany('files', {
            sort,
        });
    }),

    addFile: task(function *(this: FilesManagerComponent, id: string) {
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

        this.toast.success(this.i18n.t('file_browser.file_added_toast'));
    }),
}) {
    @service i18n!: I18N;
    @service store!: DS.Store;
    @service toast!: Toast;

    node!: Node;

    displayedItems!: QueryHasManyResult<File>;
    currentFolder!: File;
    rootFolder!: File;
    pageSize = 10;

    @alias('node.userHasAdminPermission') canEdit!: boolean;
    @alias('getRootItems.isRunning') loading!: boolean;
    @alias('getCurrentFolderItems.isRunning') loadingFolderItems!: boolean;
    @alias('loadMore.isRunning') loadingMore!: boolean;

    @computed('currentFolder.files')
    get hasMore() {
        if (this.currentFolder) {
            const currentFolderItems = this.currentFolder.files as PromiseManyArrayWithMeta;
            return currentFolderItems.meta && currentFolderItems.length < currentFolderItems.meta.total;
        }

        return undefined;
    }

    @action
    goToParentFolder(currentFolder: File) {
        this.setProperties({ currentFolder: currentFolder.hasMany('parentFolder').value() });
    }

    @action
    goToFolder(targetFolder: File) {
        const folderItems = targetFolder.hasMany('files').value();

        if (folderItems === null) {
            this.getCurrentFolderItems.perform(targetFolder);
        } else {
            this.setProperties({ currentFolder: targetFolder });
        }
    }
}
