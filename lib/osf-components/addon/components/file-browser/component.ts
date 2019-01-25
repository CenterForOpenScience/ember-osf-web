import { action, computed } from '@ember-decorators/object';
import { alias, filterBy, not, notEmpty, or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import MutableArray from '@ember/array/mutable';
import Component from '@ember/component';
import { next } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { localClassNames } from 'ember-css-modules';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';
import $ from 'jquery';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';
import defaultTo from 'ember-osf-web/utils/default-to';
import getHref from 'ember-osf-web/utils/get-href';
import pathJoin from 'ember-osf-web/utils/path-join';
import { ProjectSelectState } from 'osf-components/components/project-selector/component';
import styles from './styles';
import template from './template';

enum modals {
    None = '',
    Info = 'info',
    Delete = 'delete',
    DeleteMultiple = 'deleteMultiple',
    RenameConflict = 'renameConflict',
    Move = 'move',
    MoveToNew = 'moveToNew',
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
@layout(template, styles)
@localClassNames('file-browser')
export default class FileBrowser extends Component {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service ready!: Ready;
    @service store!: DS.Store;
    @service toast!: Toast;

    @requiredAction openFile!: (file: File, show: string) => void;
    @requiredAction moveFile!: (file: File, node: Node) => void;
    @requiredAction renameFile!: (file: File, renameValue: string, conflict?: string, conflictingItem?: File) => void;
    @requiredAction addFile!: (fileId: string) => void;
    @requiredAction deleteFiles!: (files: File[]) => void;

    clickHandler?: JQuery.EventHandlerBase<HTMLElement, JQuery.Event>;
    dismissPop?: () => void;
    canEdit: boolean = defaultTo(this.canEdit, false);
    dropping: boolean = false;
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
    isNewProject?: boolean;
    isChildNode?: boolean;
    isProjectSelectorValid: boolean = false;
    sort: string = '';

    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: true,
        acceptDirectories: false,
    };

    moveToProject = task(function *(this: FileBrowser) {
        if (!this.node) {
            return;
        }
        this.analytics.track('file', 'move', 'Quick Files - Move to project');

        this.setProperties({
            isMoving: true,
        });

        const selectedItem = this.selectedItems.firstObject;
        const isNewProject = !!this.node && !!this.node.isNew;
        const isChildNode = !!this.node && !!this.node.links && !!this.node.links.relationships!.parent;

        const moveSuccess: boolean = yield this.moveFile(selectedItem as unknown as File, this.node);

        let successPropertyUpdates = {};

        if (moveSuccess) {
            successPropertyUpdates = {
                currentModal: modals.SuccessMove,
                isNewProject,
                isChildNode,
                projectSelectState: ProjectSelectState.main,
                isProjectSelectorValid: false,
            };
        }

        const propertyUpdates = {
            isMoving: false,
            ...successPropertyUpdates,
        };

        this.setProperties(propertyUpdates);
    });

    @not('items') loading!: boolean;
    @alias('user.links.relationships.quickfiles.links.upload.href') uploadUrl!: string;
    @alias('user.links.relationships.quickfiles.links.download.href') downloadUrl!: string;
    @alias('node.links.html') nodeLink!: string;
    @alias('canEdit') dropzone!: boolean;
    @notEmpty('uploading') isUploading!: boolean;
    @filterBy('items', 'isSelected', true) selectedItems!: File[];
    @notEmpty('filter') showFilterInput!: boolean;
    @or('showFilterClicked', 'showFilterInput') showFilter!: boolean;
    @or('items.length', 'filter', 'isUploading') showItems!: boolean;

    @computed('selectedItems.firstObject.guid')
    get link(): string | undefined {
        const { guid } = this.selectedItems.firstObject as unknown as File;
        return guid ? pathJoin(window.location.origin, guid) : undefined;
    }

    @computed('items.[]')
    get hasItems() {
        return this.items && this.items.length;
    }

    @computed('canEdit', 'hasItems', 'showFilter', 'showRename')
    get clickable(): string[] {
        if (!this.canEdit || this.showFilter || this.showRename) {
            return [];
        }

        return [
            '.dz-upload-button',
            this.hasItems ? '' : '.file-browser-list',
        ].filter(item => item.length);
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

        const clickHandler: JQuery.EventHandlerBase<HTMLElement, JQuery.Event> = (e: JQuery.TriggeredEvent): void => {
            const { target } = e;
            const targetClass = $(target as Element).attr('class');

            const shouldClick = $(target as Element).parents('.popover.in').length === 0
                && targetClass
                && !targetClass.includes('popover-toggler');

            if (shouldClick && this.dismissPop) {
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
    addedFile(_: any, __: any, file: any) {
        this.uploading.pushObject(file);
    }

    @action
    uploadProgress(_: any, __: any, file: any, progress: number) {
        $(`#uploading-${file.size}`).css('width', `${progress}%`);
    }

    @action
    error(_: any, __: any, file: any, response: any) {
        this.uploading.removeObject(file);
        this.toast.error(response.message_long || response.message || response);
    }

    @action
    async success(_: any, __: any, file: any, response: any) {
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
    selectItem(this: FileBrowser, currentItem: File) {
        this.analytics.track('file', 'select', 'Quick Files - Select file');

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

            const otherItem = this.selectedItems.firstObject as unknown as File;
            otherItem.set('isSelected', false);
        }

        currentItem.set('isSelected', true);

        this.setProperties({
            renameValue: currentItem.itemName,
            shiftAnchor: currentItem,
        });
    }

    @action
    selectMultiple(this: FileBrowser, currentItem: File, toggle: boolean) {
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

        next(this, function() {
            if (this.selectedItems.length === 1) {
                this.set('shiftAnchor', currentItem);
            }
        });

        this.analytics.track('file', 'select', 'Quick Files - Select multiple files');
    }

    @action
    viewItem() {
        const item = this.selectedItems.firstObject as unknown as File;
        this.openFile(item, 'view');
    }

    @action
    openItem(item: File, show: string) {
        this.openFile(item, show);
    }

    @action
    downloadItem() {
        const file = this.selectedItems.firstObject as unknown as File;
        // TODO: Make this a link that looks like a button
        window.location.href = getHref(file.links.download!);
        if (!this.canEdit) {
            this.analytics.click('button', 'Quick Files - Download');
        }
    }

    @action
    downloadZip() {
        window.location.href = this.downloadUrl;
    }

    @action
    deleteItems(this: FileBrowser, multiple: boolean = false) {
        this.analytics.track('file', 'delete', 'Quick Files - Delete files');
        this.deleteFiles(multiple ? this.selectedItems.slice() : this.selectedItems.slice(0, 1));
        this.set('currentModal', modals.None);
    }

    @action
    renameConflict(this: FileBrowser, conflict: string): void {
        const { renameValue, conflictingItem } = this;
        const selectedItem = this.selectedItems.firstObject as unknown as File;

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
        this.analytics.track('file', 'rename', 'Quick Files - Rename file');

        const { renameValue } = this;
        const selectedItem = this.selectedItems.firstObject as unknown as File;
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
    openSharePopup(this: FileBrowser) {
        this.set('popupOpen', true);

        if (this.link) {
            return;
        }

        (this.selectedItems.firstObject as unknown as File).getGuid();
    }

    @action
    closeMoveToProjectModal(this: FileBrowser) {
        this.setProperties({
            projectSelectState: ProjectSelectState.main,
            currentModal: modals.None,
            isProjectSelectorValid: false,
        });
    }

    @action
    projectSelected(this: FileBrowser, node: Node) {
        this.set('node', node);
    }

    @action
    moveToNewProject(this: FileBrowser) {
        this.set('currentModal', modals.MoveToNew);
    }

    @action
    afterStay(this: FileBrowser) {
        this.set('currentModal', modals.None);
    }

    @action
    projectCreated(this: FileBrowser, node: Node) {
        this.set('node', node);
        this.get('moveToProject').perform();
    }
}
