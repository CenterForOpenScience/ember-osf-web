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

import template from './template';

export interface FilesManager {
    loading: boolean;
    loadingFolderItems: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    canEdit: boolean;
    currentFolder: File;
    fileProvider: File;
    displayedItems: File[];
    goToFolder: (item: File) => void;
    goToParentFolder: (item: File) => void;
    onSelectFile?: (item: File) => void;
    addFile: (id: string) => void;
    sortFolderItems: (sort: string) => void;
}

@tagName('')
@layout(template)
export default class FilesManagerComponent extends Component.extend({
    getRootItems: task(function *(this: FilesManagerComponent) {
        assert('@node is required', Boolean(this.node));

        const fileProviders = yield this.node.files;
        const fileProvider = fileProviders.firstObject as FileProvider;
        const rootItems = yield fileProvider.files;

        this.setProperties({
            fileProvider,
            currentFolder: null,
            displayedItems: rootItems,
        });
    }).on('didReceiveAttrs').restartable(),
    loadMore: task(function *(this: FilesManagerComponent) {
        const folder = this.currentFolder || this.fileProvider;
        const items = folder.files;

        const atPage = Math.ceil(this.displayedItems.length / this.pageSize);
        const moreItems = yield folder.queryHasMany('files', {
            page: atPage + 1,
            pageSize: this.pageSize,
        });

        items.pushObjects([...moreItems]);
    }),

    getCurrentFolderItems: task(function *(this: FilesManagerComponent, targetFolder: File) {
        this.set('currentFolder', targetFolder);

        const displayedItems = yield targetFolder.files;

        this.setProperties({ displayedItems });
    }),

    addFile: task(function *(this: FilesManagerComponent, id: string) {
        const duplicate = this.displayedItems.findBy('id', id);
        const file = yield this.store
            .findRecord('file', id, duplicate ? {} : { adapterOptions: { query: { create_guid: 1 } } });

        if (duplicate) {
            this.displayedItems.removeObject(duplicate);
        }

        this.displayedItems.pushObject(file);

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
    currentFolder: File | null = null;
    fileProvider!: File;
    pageSize = 10;

    @alias('node.userHasAdminPermission') canEdit!: boolean;
    @alias('getRootItems.isRunning') loading!: boolean;
    @alias('getCurrentFolderItems.isRunning') loadingFolderItems!: boolean;
    @alias('loadMore.isRunning') loadingMore!: boolean;

    @computed('displayedItems.[]', 'currentFolder')
    get hasMore() {
        if (this.displayedItems) {
            return this.displayedItems.length < this.displayedItems.meta.total;
        }

        return undefined;
    }

    @action
    goToParentFolder(currentFolder: File) {
        const parentFolder = currentFolder.belongsTo('parentFolder').value() as (File | null);
        const hasManyReference = (parentFolder || this.fileProvider).hasMany('files');

        this.setProperties({
            displayedItems: hasManyReference.value(),
            currentFolder: parentFolder,
        });
    }

    @action
    goToFolder(targetFolder: File) {
        const folderItems = targetFolder.hasMany('files').value();

        if (folderItems === null) {
            this.getCurrentFolderItems.perform(targetFolder);
        } else {
            this.setProperties({
                displayedItems: folderItems,
                currentFolder: targetFolder,
            });
        }
    }
}
