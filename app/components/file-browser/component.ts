import { action, computed } from '@ember-decorators/object';
import { alias, filterBy, not, notEmpty } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { ProjectSelectState } from 'ember-osf-web/components/project-selector/component';
import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import analytics from 'ember-osf-web/services/analytics';
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
export default class FileBrowser extends Component.extend({
    didInsertElement(this: FileBrowser, ...args) {
        this._super(...args);

        const dismissPop = () => !this.isDestroyed && this.setProperties({ popupOpen: false });

        const clickHandler = e => {
            const { target } = e;
            const targetClass = $(target).attr('class');

            const shouldClick = $(e.target).parents('.popover.in').length === 0
                && targetClass
                && !targetClass.includes('popover-toggler');

            if (shouldClick) {
                this.get('dismissPop').bind(this)();
            }
        };

        this.setProperties({
            dismissPop,
            clickHandler,
        });

        $('body').click(clickHandler);
        $(window).resize(dismissPop);
    },

    willDestroyElement(this: FileBrowser, ...args) {
        $(window).off('resize', this.get('dismissPop'));
        $('body').off('click', this.get('clickHandler'));

        this._super(...args);
    },
}) {
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
    node: Node | null = this.node || null;
    nodeTitle = null;
    newProject: Node = this.newProject;
    isNewProject: boolean;
    isChildNode: boolean;
    projectSelectState: ProjectSelectState = ProjectSelectState.main;
    isMoving = false;
    loaded = true;
    uploading = A([]);
    currentModal = modals.None;
    popupOpen: boolean = false;
    itemsLoaded = true;
    items: File[] | null = null;
    conflictingItem: File | null = null;
    showFilterClicked: boolean = false;
    filter: string = this.filter || '';
    shiftAnchor = null;

    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: true,
        acceptDirectories: false,
    };

    moveToProject = task(function* (this: FileBrowser) {
        this.setProperties({
            isMoving: true,
        });

        const selectedItem = this.get('selectedItems.firstObject');
        const node = this.get('node');
        const isNewProject = !!node && node.get('isNew');
        const isChildNode = !!node && !!node.get('links.relationships.parent');

        const moveSuccess: boolean = yield this.get('moveFile')(selectedItem, node);
        this.get('analytics').track('file', 'move', 'Quick Files - Move to project');

        const successPropertyUpdates = {
            currentModal: modals.SuccessMove,
            isNewProject,
            isChildNode,
            projectSelectState: ProjectSelectState.main,
        };

        const propertyUpdates = {
            isMoving: false,
            ...(moveSuccess ? successPropertyUpdates : {}),
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
    get link(this: FileBrowser): string | undefined {
        const guid = this.get('selectedItems.firstObject.guid');
        return guid ? pathJoin(window.location.origin, guid) : undefined;
    }

    @computed('canEdit', 'loading', 'items.[]', 'filter')
    get clickable(this: FileBrowser) {
        const cssClass = ['.dz-upload-button'];
        if (this.get('loading') || this.get('filter')) {
            return cssClass;
        }

        if (!this.get('items.length') && this.get('canEdit')) {
            cssClass.push('.file-browser-list');
        }

        return cssClass;
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
    addedFile(this: FileBrowser, _, __, file) {
        this.get('uploading').pushObject(file);
    }

    @action
    uploadProgress(this: FileBrowser, _, __, file, progress) {
        $(`#uploading-${file.size}`).css('width', `${progress}%`);
    }

    @action
    error(this: FileBrowser, _, __, file, response) {
        this.get('uploading').removeObject(file);
        this.get('toast').error(response.message_long || response.message || response);
    }

    @action
    success(this: FileBrowser, _, __, file, response) {
        this.get('analytics').track('file', 'upload', 'Quick Files - Upload');
        this.get('uploading').removeObject(file);
        this.get('toast').success(this.get('i18n').t('file_browser.file_added_toast'));
        this.get('addFile')(response.data.id.replace(/^.*\//, ''));
    }

    @action
    buildUrl(this: FileBrowser, files) {
        const { name } = files[0];

        for (const file of this.get('items')) {
            if (name === file.get('itemName')) {
                return file.get('links.upload');
            }
        }

        return `${this.get('uploadUrl')}?${$.param({ name })}`;
    }

    @action
    selectItem(this: FileBrowser, currentItem) {
        if (this.get('openOnSelect')) {
            this.openFile(currentItem, 'view');
        }

        this.setProperties({
            popupOpen: false,
        });

        if (this.get('selectedItems.length') > 1) {
            for (const item of this.get('selectedItems')) {
                item.set('isSelected', item === currentItem);
            }
        } else if (this.get('selectedItems.length') === 1) {
            if (currentItem.get('isSelected') && this.get('unselect')) {
                currentItem.set('isSelected', false);
                return;
            }

            const otherItem = this.get('selectedItems.firstObject');
            otherItem.set('isSelected', false);
        }

        currentItem.set('isSelected', true);

        this.setProperties({
            renameValue: currentItem.get('itemName'),
            shiftAnchor: currentItem,
        });
    }

    @action
    selectMultiple(this: FileBrowser, currentItem, toggle) {
        const items: File[] | null = this.get('items');

        if (!this.get('multiple') || !items) {
            return;
        }

        this.setProperties({
            popupOpen: false,
            renameValue: '',
            showRename: false,
        });

        if (toggle) {
            currentItem.toggleProperty('isSelected');
        } else {
            const anchor = this.get('shiftAnchor');

            if (anchor) {
                const anchorIndex = items.indexOf(anchor);
                const itemIndex = items.indexOf(currentItem);
                const max = Math.max(anchorIndex, itemIndex);
                const min = Math.min(anchorIndex, itemIndex);

                items.forEach((item, index) => {
                    item.set('isSelected', index >= min && index <= max);
                });
            } else {
                currentItem.set('isSelected', true);
            }
        }

        next(this, function () {
            if (this.get('selectedItems.length') === 1) {
                this.set('shiftAnchor', currentItem);
            }
        });
    }

    @action
    viewItem(this: FileBrowser) {
        const item = this.get('selectedItems.firstObject');
        this.openFile(item, 'view');
    }

    @action
    openItem(this: FileBrowser, item, qparams) {
        this.openFile(item, qparams);
    }

    @action
    downloadItem(this: FileBrowser) {
        window.location.href = this.get('selectedItems.firstObject.links.download');
    }

    @action
    downloadZip(this: FileBrowser) {
        window.location.href = this.get('downloadUrl');
    }

    @action
    deleteItems(this: FileBrowser, multiple: boolean = false) {
        const selectedItems = this.get('selectedItems');
        this.get('deleteFiles')(multiple ? selectedItems.slice() : selectedItems.slice(0, 1));
        this.set('currentModal', modals.None);
    }

    @action
    renameConflict(this: FileBrowser, conflict): void {
        const renameValue = this.get('renameValue');
        const selectedItem = this.get('selectedItems.firstObject');
        const conflictingItem = this.get('conflictingItem');

        this.setProperties({
            currentModal: modals.None,
            renameValue: '',
        });

        if (conflict === 'replace' && conflictingItem) {
            this.get('renameFile')(selectedItem, renameValue, conflict, conflictingItem);
        }

        this.setProperties({
            conflictingItem: null,
            renameValue: '',
            showRename: false,
        });
    }

    @action
    rename(this: FileBrowser): void {
        const renameValue = this.get('renameValue');
        const selectedItem = this.get('selectedItems.firstObject');
        const conflictingItem = this.get('items')
            .find(item => item.get('itemName') === renameValue);

        if (conflictingItem) {
            // Renaming the file to the name it's current name (so do a noop)
            if (conflictingItem.get('id') === selectedItem.get('id')) {
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

        this.get('renameFile')(selectedItem, renameValue);

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

        if (this.get('link')) {
            return;
        }

        this.get('selectedItems.firstObject').getGuid();
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
