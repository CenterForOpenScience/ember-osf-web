import { action, computed } from '@ember-decorators/object';
import { alias, filterBy, not, notEmpty } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import MutableArray from '@ember/array/mutable';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { ProjectSelectState } from 'ember-osf-web/components/project-selector/component';
import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import eatArgs from 'ember-osf-web/utils/eat-args';
import pathJoin from 'ember-osf-web/utils/path-join';
import $ from 'jquery';

enum modals {
    None = '',
    Info = 'info',
    Delete = 'delete',
    DeleteMultiple = 'deleteMultiple',
    RenameConflict = 'renameConflict',
    Move = 'move',
    SuccessMove = 'successMove',
}

// TODO: Improve documentation in the future
/**
 * File browser widget
 *
 * Sample usage:
 * ```handlebars
 * {{file-browser
 * }}
 * ```
 * @class file-browser
 */
export default class FileBrowser extends Component {
    @service analytics;
    @service currentUser;
    @service i18n;
    @service ready;
    @service store;
    @service toast;

    clickHandler: (e) => void;
    dismissPop: () => void;
    canEdit: boolean;
    showRename: boolean = false;
    renameValue: string = '';
    multiple = true;
    unselect = true;
    openOnSelect = false;
    projectList = null;
    isLoadingProjects = null;
    selectedFile = null;
    node: Node | null = defaultTo(this.node, null);
    nodeTitle = null;
    newProject: Node = this.newProject;
    projectSelectState: ProjectSelectState = ProjectSelectState.main;
    isMoving = false;
    loaded = true;
    uploading: MutableArray<any> = A([]);
    currentModal = modals.None;
    popupOpen: boolean = false;
    items: File[] | null = null;
    conflictingItem: File | null = null;
    showFilterClicked: boolean = false;
    filter: string = defaultTo(this.filter, '');
    shiftAnchor: File | null = null;
    isNewProject: boolean;
    isChildNode: boolean;

    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: true,
        acceptDirectories: false,
    };

    moveToProject = task(function* (this: FileBrowser) {
        if (!this.node) {
            return;
        }

        this.setProperties({
            isMoving: true,
        });

        const selectedItem = this.selectedItems.firstObject;
        const isNewProject = !!this.node && !!this.node.isNew;
        const isChildNode = !!this.node && !!this.node.links.relationships.parent;

        const moveSuccess: boolean = yield this.moveFile(selectedItem, this.node);
        this.analytics.track('file', 'move', 'Quick Files - Move to project');

        let successPropertyUpdates = {};

        if (moveSuccess) {
            successPropertyUpdates = {
                currentModal: modals.SuccessMove,
                isNewProject,
                isChildNode,
                projectSelectState: ProjectSelectState.main,
            };
        }

        const propertyUpdates = {
            isMoving: false,
            ...successPropertyUpdates,
        };

        this.setProperties(propertyUpdates);
    });

    @not('items') loading;
    @alias('user.links.relationships.quickfiles.links.upload.href') uploadUrl;
    @alias('user.links.relationships.quickfiles.links.download.href') downloadUrl;
    @alias('node.links.html') nodeLink;
    @alias('canEdit') dropzone;
    @notEmpty('uploading') isUploading;
    @filterBy('items', 'isSelected', true) selectedItems;
    @notEmpty('filter') showFilterInput: boolean;

    @computed('selectedItems.firstObject.guid')
    get link(): string | undefined {
        const { guid } = this.selectedItems.firstObject;
        return guid ? pathJoin(window.location.origin, guid) : undefined;
    }

    @computed('items.[]')
    get hasItems() {
        return this.items && this.items.length;
    }


    @computed('canEdit', 'hasItems', 'showFilterInput', 'showRename')
    get clickable(): string | string[] {
        const cssClass = [];

        if (!this.get('showFilterInput') && !this.get('showRename') && this.get('canEdit')) {
            cssClass.push('.dz-upload-button');

            if (!this.get('hasItems')) {
                cssClass.push('.file-browser-list');
            }
        }

        return cssClass.length ? cssClass : '';
    }

    /**
     * Placeholder for closure action: openFile
     */
    openFile(file: File, show: string): void {
        eatArgs(file, show);
        assert('You should pass in a closure action: openFile');
    }

    /**
     * Placeholder for closure action: moveFile
     */
    moveFile(file: File, node: Node): void {
        eatArgs(file, node);
        assert('You should pass in a closure action: moveFile');
    }

    /**
     * Placeholder for closure action: renameFile
     */
    renameFile(file: File, renameValue: string, conflict?: boolean, conflictingItem?: File): void {
        eatArgs(file, renameValue, conflict, conflictingItem);
        assert('You should pass in a closure action: renameFile');
    }

    /**
     * Placeholder for closure action: addFile
     */
    addFile(fileId: string): void {
        eatArgs(fileId);
        assert('You should pass in a closure action: addFile');
    }

    /**
     * Placeholder for closure action: deleteFiles
     */
    deleteFiles(files: File[]): void {
        eatArgs(files);
        assert('You should pass in a closure action: deleteFiles');
    }

    didReceiveAttrs() {
        if (this.items && this.items.length) {
            this.items.filterBy('isSelected', true)
                .forEach(item => item.set('isSelected', false));
        }
    }

    didInsertElement(this: FileBrowser) {
        super.didInsertElement();

        const dismissPop = () => !this.isDestroyed && this.setProperties({ popupOpen: false });

        const clickHandler = e => {
            const { target } = e;
            const targetClass = $(target).attr('class');

            const shouldClick = $(e.target).parents('.popover.in').length === 0
                && targetClass
                && !targetClass.includes('popover-toggler');

            if (shouldClick) {
                this.dismissPop.bind(this)();
            }
        };

        this.setProperties({
            dismissPop,
            clickHandler,
        });

        $('body').click(clickHandler);
        $(window).resize(dismissPop);
    }

    willDestroyElement() {
        $(window).off('resize', this.dismissPop);
        $('body').off('click', this.clickHandler);

        super.willDestroyElement();
    }

    @action
    closeRename(this: FileBrowser) {
        this.setProperties({
            renameValue: '',
            showRename: false,
        });
    }

    @action
    closeFilter(this: FileBrowser) {
        this.setProperties({
            showFilterClicked: false,
            filter: '',
        });
    }

    // dropzone listeners
    @action
    addedFile(_, __, file) {
        this.uploading.pushObject(file);
    }

    @action
    uploadProgress(_, __, file, progress) {
        $(`#uploading-${file.size}`).css('width', `${progress}%`);
    }

    @action
    error(_, __, file, response) {
        this.uploading.removeObject(file);
        this.toast.error(response.message_long || response.message || response);
    }

    @action
    async success(_, __, file, response) {
        this.analytics.track('file', 'upload', 'Quick Files - Upload');
        await this.addFile(response.data.id.replace(/^.*\//, ''));
        this.uploading.removeObject(file);
    }

    @action
    buildUrl(files: File[]) {
        const { name } = files[0];
        const existingFile = this.items && this.items.findBy('itemName', name);

        return existingFile ? existingFile.links.upload : `${this.uploadUrl}?${$.param({ name })}`;
    }

    @action
    selectItem(this: FileBrowser, currentItem) {
        if (this.openOnSelect) {
            this.openFile(currentItem, 'view');
        }

        this.setProperties({
            popupOpen: false,
        });

        if (this.selectedItems.length > 1) {
            for (const item of this.selectedItems) {
                item.set('isSelected', item === currentItem);
            }
        } else if (this.selectedItems.length === 1) {
            if (currentItem.isSelected && this.unselect) {
                currentItem.set('isSelected', false);
                return;
            }

            const otherItem = this.selectedItems.firstObject;
            otherItem.set('isSelected', false);
        }

        currentItem.set('isSelected', true);

        this.setProperties({
            renameValue: currentItem.itemName,
            shiftAnchor: currentItem,
        });
    }

    @action
    selectMultiple(this: FileBrowser, currentItem, toggle) {
        if (!this.multiple || !this.items) {
            return;
        }

        this.setProperties({
            popupOpen: false,
            renameValue: '',
            showRename: false,
        });

        if (toggle) {
            currentItem.toggleProperty('isSelected');
        } else if (this.shiftAnchor) {
            const anchorIndex = this.items.indexOf(this.shiftAnchor);
            const itemIndex = this.items.indexOf(currentItem);
            const max = Math.max(anchorIndex, itemIndex);
            const min = Math.min(anchorIndex, itemIndex);

            this.items.forEach((item, index) => {
                item.set('isSelected', index >= min && index <= max);
            });
        } else {
            currentItem.set('isSelected', true);
        }

        next(this, function () {
            if (this.selectedItems.length === 1) {
                this.set('shiftAnchor', currentItem);
            }
        });
    }

    @action
    viewItem() {
        const item = this.selectedItems.firstObject;
        this.openFile(item, 'view');
    }

    @action
    openItem(item: File, show: string) {
        this.openFile(item, show);
    }

    @action
    downloadItem() {
        window.location.href = this.selectedItems.firstObject.links.download;
    }

    @action
    downloadZip() {
        window.location.href = this.downloadUrl;
    }

    @action
    deleteItems(this: FileBrowser, multiple: boolean = false) {
        this.deleteFiles(multiple ? this.selectedItems.slice() : this.selectedItems.slice(0, 1));
        this.set('currentModal', modals.None);
    }

    @action
    renameConflict(this: FileBrowser, conflict): void {
        const { renameValue, conflictingItem } = this;
        const selectedItem = this.selectedItems.firstObject;

        this.setProperties({
            currentModal: modals.None,
            renameValue: '',
        });

        if (conflict === 'replace' && conflictingItem) {
            this.renameFile(selectedItem, renameValue, conflict, conflictingItem);
        }

        this.setProperties({
            conflictingItem: null,
            renameValue: '',
            showRename: false,
        });
    }

    @action
    rename(this: FileBrowser): void {
        const { renameValue } = this;
        const selectedItem = this.selectedItems.firstObject;
        const conflictingItem = this.items ? this.items
            .find(item => item.itemName === renameValue) : null;

        if (conflictingItem) {
            // Renaming the file to the name it's current name (so do a noop)
            if (conflictingItem.id === selectedItem.id) {
                this.setProperties({
                    renameValue: '',
                    showRename: false,
                });

                return;
            }

            this.setProperties({
                conflictingItem,
                currentModal: modals.RenameConflict,
            });

            return;
        }

        this.renameFile(selectedItem, renameValue);

        this.setProperties({
            renameValue: '',
            showRename: false,
        });
    }

    @action
    cancelRename(this: FileBrowser) {
        this.setProperties({
            renameValue: '',
            currentModal: modals.None,
        });
    }

    @action
    copyLink(this: FileBrowser) {
        this.set('popupOpen', true);

        if (this.link) {
            return;
        }

        this.selectedItems.firstObject.getGuid();
    }

    @action
    setSelectedNode(this: FileBrowser, node) {
        this.setProperties({
            node,
        });
    }

    @action
    closeMoveToProjectModal(this: FileBrowser) {
        this.setProperties({
            projectSelectState: ProjectSelectState.main,
            currentModal: modals.None,
        });
    }
}
