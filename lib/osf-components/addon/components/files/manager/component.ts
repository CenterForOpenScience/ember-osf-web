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
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';

import template from './template';

export interface FilesManager {
    canEdit: boolean;
    loading: boolean;
    hasMore: boolean;
    loadingFolderItems: boolean;
    currentFolder: File;
    fileProvider: File;
    displayedItems: File[];
    selectedItems: File[];
    goToFolder: (item: File) => void;
    goToParentFolder: (item: File) => void;
    unselectItem: (item: File) => void;
    selectItem: (item: File) => void;
    addFile: (id: string) => void;
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
            rootItems,
            fileProvider,
            currentFolder: null,
            displayedItems: rootItems.toArray(),
            totalRootItems: rootItems.meta.total,
        });
    }).on('didReceiveAttrs').restartable(),

    loadMore: task(function *(this: FilesManagerComponent) {
        let folder;
        let items;

        if (this.currentFolder) {
            folder = this.currentFolder;
            items = this.itemsList[this.currentFolder.id].files;
        } else {
            folder = this.fileProvider;
            items = this.rootItems;
        }

        const atPage = Math.ceil(items.length / this.pageSize);
        const moreItems = yield folder.queryHasMany('files', {
            page: atPage + 1,
            pageSize: this.pageSize,
        });

        items.pushObjects([...moreItems]);
        this.displayedItems.pushObjects([...moreItems]);
    }),

    getCurrentFolderItems: task(function *(this: FilesManagerComponent) {
        if (this.currentFolder) {
            const files = yield this.currentFolder.files;
            const totalFolderItems = files.meta.total;

            this.setProperties({
                totalFolderItems,
                displayedItems: files.toArray(),
            });

            this.itemsList[this.currentFolder.id] = {
                files,
                totalFolderItems,
                parentFolder: this.parentFolder,
            };
        }
    }),

    addFile: task(function *(this: FilesManagerComponent, id: string) {
        const duplicate = this.displayedItems.findBy('id', id);

        const file = yield this.store
            .findRecord('file', id, duplicate ? {} : { adapterOptions: { query: { create_guid: 1 } } });

        if (duplicate) {
            this.displayedItems.removeObject(duplicate);
        }

        if (this.currentFolder) {
            this.itemsList[this.currentFolder.id].files.pushObject(file);
        } else {
            this.rootItems.pushObject(file);
        }

        this.displayedItems.pushObject(file);

        if (duplicate) {
            return;
        }

        this.toast.success(this.i18n.t('file_browser.file_added_toast'));
    }),
}) {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service ready!: Ready;
    @service store!: DS.Store;
    @service toast!: Toast;

    node!: Node;

    itemsList: Record<string, {
        parentFolder: File | null,
        totalFolderItems: number,
        files: QueryHasManyResult<File>,
    }> = {};

    rootItems!: QueryHasManyResult<File>;
    displayedItems!: File[];
    currentFolder: File | null = null;
    parentFolder: File | null = null;
    selectedItems: File[] = [];
    fileProvider!: File;
    pageSize = 10;
    totalFolderItems!: number;
    totalRootItems!: number;

    onSelect?: (file: File) => void;
    onUnselect?: (file: File) => void;

    @alias('node.userHasAdminPermission') canEdit!: boolean;
    @alias('getRootItems.isRunning') loading!: boolean;
    @alias('getCurrentFolderItems.isRunning') loadingFolderFiles!: boolean;

    @computed('displayedItems.[]', 'currentFolder', 'totalFolderItems')
    get hasMore() {
        if (this.displayedItems) {
            const currentTotal = this.currentFolder ? this.totalFolderItems : this.totalRootItems;
            return this.displayedItems.length < currentTotal;
        }

        return undefined;
    }

    @action
    selectItem(currentItem: File) {
        this.selectedItems.pushObject(currentItem);
        if (this.onSelect) {
            this.onSelect(currentItem);
        }
    }

    @action
    unselectItem(item: File) {
        this.selectedItems.removeObject(item);
        if (this.onUnselect) {
            this.onUnselect(item);
        }
    }

    @action
    goToParentFolder(currentFolder: File) {
        this.setProperties({
            currentFolder: this.itemsList[currentFolder.id].parentFolder,
        });

        if (this.currentFolder) {
            this.setProperties({
                displayedItems: this.itemsList[this.currentFolder.id].files,
                totalFolderItems: this.itemsList[this.currentFolder.id].totalFolderItems,
            });
        } else {
            this.setProperties({
                displayedItems: this.rootItems,
            });
        }
    }

    @action
    goToFolder(targetFolder: File) {
        this.setProperties({
            parentFolder: this.currentFolder,
            currentFolder: targetFolder,
        });

        if (targetFolder.id in this.itemsList) {
            this.setProperties({
                displayedItems: this.itemsList[targetFolder.id].files,
                totalFolderItems: this.itemsList[targetFolder.id].totalFolderItems,
            });
        } else {
            this.getCurrentFolderItems.perform();
        }
    }
}
