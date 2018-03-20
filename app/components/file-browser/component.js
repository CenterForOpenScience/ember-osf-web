import Ember from 'ember';
import layout from './template';
import { task } from 'ember-concurrency';

import loadAll from 'ember-osf-web/utils/load-relationship';
import outsideClick from 'ember-osf-web/utils/outside-click';
import Analytics from 'ember-osf-web/mixins/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';
import permissions from 'ember-osf-web/const/permissions';

const dropzoneOptions = {
    createImageThumbnails: false,
    method: 'PUT',
    withCredentials: true,
    preventMultipleFiles: true,
    acceptDirectories: false,
};
/**
 * File browser widget
 *
 * Sample usage:
 * ```handlebars
 * {{file-browser}}
 * ```
 * @class file-browser
 */
export default Ember.Component.extend(Analytics, {
    // TODO: Improve documentation in the future
    layout,
    dropzoneOptions,
    // Can be overwritten to have a trimmed down display, these are all the options available to be displayed
    display: Ember.A(['header', 'size-column', 'version-column', 'downloads-column', 'modified-column', 'delete-button', 'move-button', 'rename-button', 'download-button', 'view-button', 'info-button', 'upload-button', 'share-button']),
    i18n: Ember.inject.service(),
    store: Ember.inject.service(),
    toast: Ember.inject.service(),
    ready: Ember.inject.service(),
    classNames: ['file-browser'],
    multiple: true,
    unselect: true,
    openOnSelect: false,
    projectList: Ember.A(),
    isLoadingProjects: null,
    selectedFile: null,
    node: null,
    nodeTitle: null,
    newProject: false,
    projectSelectState: 'main',
    isInputInvalid: true,
    nodeLink: Ember.computed.alias('node.links.html'),
    isMoving: false,

    init() {
        this._super(...arguments);
        this.set('_items', Ember.A());
        outsideClick(function() {
            this.send('dismissPop');
        }.bind(this));
        Ember.$(window).resize(function() {
            this.send('dismissPop');
        }.bind(this));
        this.get('_loadUser').perform();
        this._loadProjects(this.get('user'));
    },
    currentUser: Ember.inject.service(),
    dropzone: Ember.computed.alias('edit'),
    edit: Ember.computed('user', function() {
        return this.get('user.id') === this.get('currentUser.currentUserId');
    }),
    _loadFiles(user) {
        // pagination? when?
        loadAll(user, 'quickfiles', this.get('_items')).then(() => {
            this.set('loaded', true);
            this.set('_items', this.get('_items').sortBy('itemName'));
            this.get('_items').forEach(item => {
                if (this.get('selectedFile.id') && this.get('selectedFile.id') === item.id) {
                    item.isSelected = true; // eslint-disable-line no-param-reassign
                }
            });
            this.get('readyHandle').finished();
        }).catch(this.get('readyHandle').errored);
    },
    _loadProjects(user) {
        loadAll(user, 'nodes', this.get('projectList')).then(() => {
            const onlyWriteNodes = this.get('projectList').filter(item => item.get('currentUserPermissions').includes(permissions.WRITE));
            this.set('projectList', onlyWriteNodes);
            this.set('isLoadingProjects', false);
        });
    },
    _addNewNodeToList(user, node) {
        this.get('projectList').unshiftObject(node);
    },
    _loadUser: task(function* () {
        this.set('readyHandle', this.get('ready').wait());
        const user = yield this.get('user');
        if (!user || this.get('loaded')) {
            return;
        }
        // items need to be reloaded when attrs are received
        // TODO: think about replacing _items with user.items, provided it's loaded properly
        const _load = user_ => {
            Ember.run(() => {
                this.set('_items', Ember.A());
                Ember.run.next(() => {
                    this._loadFiles(user_);
                });
            });
        };
        if (user.then) {
            user.then(user_ => {
                _load(user_);
            });
        } else {
            _load(user);
        }
    }),
    uploadUrl: Ember.computed('user', function() {
        return this.get('user.links.relationships.quickfiles.links.upload.href');
    }),
    downloadUrl: Ember.computed('user', function() {
        return this.get('user.links.relationships.quickfiles.links.download.href');
    }),
    loaded: false,
    filtering: false,
    renaming: false,
    sortingBy: 'itemName',
    sortingOrder: 'asc',
    uploading: Ember.A(),
    isUploading: Ember.computed.notEmpty('uploading'),
    filter: null,
    modalOpen: false,
    popupOpen: false,
    itemsLoaded: true,
    selectedItems: Ember.computed.filterBy('items', 'isSelected', true),
    loadedChanged: Ember.observer('itemsLoaded', function() {
        const containerWidth = this.$().width();
        this.set('itemWidth', containerWidth);
    }),
    link: Ember.computed('selectedItems.firstObject.guid', function() {
        const guid = this.get('selectedItems.firstObject.guid');
        return guid ? pathJoin(window.location.origin, guid) : undefined;
    }),
    flash(item, message, type, time) {
        item.set('flash', {
            message,
            type: type || 'success',
        });
        Ember.run.later(() => item.set('flash', null), time || 2000);
    },
    items: Ember.computed('_items', 'textValue', 'filtering', 'sortingBy', 'sortingOrder', function() {
        // look at ways to use the api to filter
        const items = this.get('textValue') && this.get('filtering') ? this.get('_items').filter(i => i.get('name').toLowerCase().indexOf(this.get('textValue').toLowerCase()) !== -1) : this.get('_items');
        const sorted = items.sortBy(this.get('sortingBy'));
        return this.get('sortingOrder') === 'des' ? sorted.reverse() : sorted;
    }),
    textFieldOpen: Ember.computed('filtering', 'renaming', function() {
        if (!this.get('filtering')) {
            return this.get('renaming') ? 'renaming' : false;
        }
        return 'filtering';
    }),
    nameColumnWidth: Ember.computed('display', function() {
        const display = this.get('display');
        const width = 6 + !display.includes('share-link-column') + !display.includes('size-column') + !display.includes('version-column') + !display.includes('downloads-column') + (2 * !display.includes('modified-column'));
        if (!display.includes('header')) { // Allows scrollable elements to use extra space occupied by header
            const height = Ember.$('.file-browser-list').height();
            Ember.$('.file-browser-list').height(height + 50);
        }
        return width;
    }),
    browserState: Ember.computed('loaded', '_items', function() {
        if (this.get('loaded')) {
            if (this.get('_items').length) {
                return this.get('items').length ? 'show' : 'filtered';
            }
            return 'empty';
        }
        return 'loading';
    }),
    clickable: Ember.computed('browserState', function() {
        const clickable = ['.dz-upload-button'];
        if (this.get('browserState') === 'empty') {
            clickable.push('.file-browser-list');
        }
        return clickable;
    }),
    actions: {
        // dropzone listeners
        addedFile(_, __, file) {
            this.get('uploading').pushObject(file);
        },
        uploadProgress(_, __, file, progress) {
            Ember.$(`#uploading-${file.size}`).css('width', `${progress}%`);
        },
        dragStart() {
            this.set('dropping', true);
        },
        dragEnd() {
            this.set('dropping', false);
        },
        error(_, __, file, response) {
            this.get('uploading').removeObject(file);
            this.get('toast').error(response.message_long || response.message || response);
        },
        success(_, __, file, response) {
            this.send('track', 'upload', 'track', 'Quick Files - Upload');
            this.get('uploading').removeObject(file);
            const data = response.data.attributes;
            // OPTIONS (some not researched)
            // Ember store method for passing updated attributes (either with a query for the object, or iterating to find matching)
            // Manually updating the object based on new attrs
            // Making an additional request anytime success is done, finding the file detail page based on path
            const { path } = data; // THERE SHOULD BE A BETTER WAY OF DOING THIS
            let conflictingItem = false;
            for (const file of this.get('_items')) {
                if (path === file.get('path')) {
                    conflictingItem = file;
                    break;
                }
            }
            if (conflictingItem) {
                conflictingItem.setProperties({
                    size: data.size,
                    currentVersion: data.extra.version,
                    dateModified: data.modified_utc,
                });
                return;
            }
            response.data.type = 'file'; //
            response.data.attributes.currentVersion = '1';
            // Strip prefix.
            response.data.id = response.data.id.replace(/^[^\/]*\//, ''); // eslint-disable-line no-useless-escape
            const item = this.get('store').push(response);
            item.set('links', response.data.links); // Push doesnt pass it links
            this.get('_items').unshiftObject(item);
            this.notifyPropertyChange('_items');
            item.getGuid();
            Ember.run.next(() => {
                this.flash(item, 'This file has been added.');
                this.get('toast').success('A file has been added');
            });
        },
        buildUrl(files) {
            const { name } = files[0];
            let conflictingItem = false;
            for (const file of this.get('_items')) {
                if (name === file.get('itemName')) {
                    conflictingItem = file;
                    break;
                }
            }
            if (conflictingItem) {
                return conflictingItem.get('links.upload');
            }
            return `${this.get('uploadUrl')}?${Ember.$.param({
                name: files[0].name,
            })}`;
        },
        selectItem(item) {
            if (this.get('openOnSelect')) {
                this.openFile(item, 'view');
            }
            this.set('renaming', false);
            this.set('popupOpen', false);
            if (this.get('selectedItems.length') > 1) {
                for (const item_ of this.get('selectedItems')) {
                    item_.set('isSelected', item_ === item);
                }
            } else if (this.get('selectedItems.length') === 1) {
                if (item.get('isSelected') && this.get('unselect')) {
                    item.set('isSelected', false);
                    return;
                }
                const otherItem = this.get('selectedItems.firstObject');
                otherItem.set('isSelected', false);
            }
            item.set('isSelected', true);
            this.set('shiftAnchor', item);
        },
        selectMultiple(item, toggle) {
            if (!this.get('multiple')) {
                return;
            }
            this.set('renaming', false);
            this.set('popupOpen', false);
            if (toggle) {
                item.toggleProperty('isSelected');
            } else {
                const items = this.get('items');
                const anchor = this.get('shiftAnchor');
                if (anchor) {
                    const max = Math.max(items.indexOf(anchor), items.indexOf(item));
                    const min = Math.min(items.indexOf(anchor), items.indexOf(item));
                    for (const item_ of this.get('items')) {
                        item_.set('isSelected', item_ === item || item_ === anchor || (items.indexOf(item_) > min && items.indexOf(item_) < max));
                    }
                }
                item.set('isSelected', true);
            }
            Ember.run.next(this, function() {
                if (this.get('selectedItems.length') === 1) {
                    this.set('shiftAnchor', item);
                }
            });
        },
        viewItem() {
            const item = this.get('selectedItems.firstObject');
            this.openFile(item, 'view');
        },
        openItem(item, qparams) {
            this.openFile(item, qparams);
        },
        downloadItem() {
            const downloadLink = this.get('selectedItems.firstObject.links.download');
            window.location = downloadLink;
        },
        downloadZip() {
            const downloadLink = this.get('downloadUrl');
            window.location = downloadLink;
        },
        _deleteItem(item) {
            item.destroyRecord().then(() => {
                this.flash(item, 'This file has been deleted.', 'danger');
                Ember.run.later(() => {
                    this.get('_items').removeObject(item);
                    this.notifyPropertyChange('_items');
                }, 1800);
            }).catch(() => this.flash(item, 'Delete failed.', 'danger'));
        },
        deleteItem() {
            this.send('_deleteItem', this.get('selectedItems.firstObject'));
            this.set('modalOpen', false);
        },
        deleteItems() {
            for (const item_ of this.get('selectedItems')) {
                this.send('_deleteItem', item_);
            }
            this.set('modalOpen', false);
        },
        _rename(conflict) {
            const item = this.get('selectedItems.firstObject');
            this.set('modalOpen', false);
            item.rename(this.get('textValue'), conflict).then(() => {
                this.flash(item, 'Successfully renamed');
                if (conflict === 'replace') {
                    const replacedItem = this.get('_conflictingItem');
                    if (!replacedItem) {
                        return;
                    }
                    this.flash(replacedItem, 'This file has been replaced', 'danger');
                    setTimeout(() => {
                        this.get('_items').removeObject(replacedItem);
                        this.notifyPropertyChange('_items');
                    }, 1800);
                    // Later to avoid flash() trying to set on a destroyed item.
                    Ember.run.later(() => replacedItem.unloadRecord(), 2200);
                }
            }).catch(() => this.flash(item, 'Failed to rename item', 'danger'));
            this.set('textValue', null);
            this.toggleProperty('renaming');
        },
        rename() {
            const rename = this.get('textValue');
            let conflict = false;
            for (const item of this.get('_items')) {
                if (item.get('itemName') === rename) {
                    if (item === this.get('selectedItems.firstObject')) {
                        this.set('textValue', null);
                        this.toggleProperty('renaming');
                        return;
                    }
                    conflict = true;
                    this.set('_conflictingItem', item);
                    break;
                }
            }
            if (conflict) {
                this.set('modalOpen', 'renameConflict');
            } else {
                this.send('_rename');
            }
        },
        cancelRename() {
            this.set('textValue', null);
            this.toggleProperty('renaming');
            this.set('modalOpen', false);
        },
        sort(by, order) {
            this.$('.sorting').removeClass('active');
            this.$(`.${by}${order}`).addClass('active');
            this.setProperties({
                sortingBy: by,
                sortingOrder: order,
            });
        },
        toggleText(which) {
            this.set('textValue', which === 'renaming' ? this.get('selectedItems.firstObject.itemName') : null);
            this.toggleProperty(which);
        },
        openModal(modalType) {
            this.set('modalOpen', modalType);
        },
        closeModal() {
            if (this.get('modalOpen') === 'move') {
                this.set('projectSelectState', 'main');
            }
            this.set('modalOpen', false);
        },
        textValueKeypress() {
            if (this.get('renaming')) {
                this.send('rename');
            }
        },
        copyLink() {
            this.set('popupOpen', true);
            if (this.get('link')) {
                return;
            }
            this.get('selectedItems.firstObject').getGuid();
        },
        dismissPop() {
            this.set('popupOpen', false);
        },
        checkNodeTitleKeypress(value) {
            this.set('nodeTitle', value);
            this.set('isInputInvalid', Ember.isBlank(value));
        },
        changeProjectSelectState(state) {
            this.set('projectSelectState', state);
            this.set('isInputInvalid', true);
        },
        setSelectedNode(node, isChild) {
            this.set('node', node);
            this.set('isChildNode', isChild);
            this.set('isInputInvalid', false);
        },
        setMoveFile() {
            this.set('isMoving', true);
            const selectedItem = this.get('selectedItems.firstObject');
            const title = this.get('nodeTitle');

            if (this.get('projectSelectState') === 'newProject') {
                this.set('newProject', true);
                this._createProject(title).then(project => {
                    this.set('node', project);
                    this._addNewNodeToList(this.get('user'), project);
                    this._moveFile(selectedItem, project);
                });
            } else if (this.get('projectSelectState') === 'existingProject') {
                this._moveFile(selectedItem, this.get('node'));
                this.set('newProject', false);
            }
        },
    },
    _createProject(title) {
        return this.get('store').createRecord('node', {
            public: true,
            category: 'project',
            title,
        }).save()
            .catch(() => this.get('toast').error(this.get('i18n').t('move_to_project.could_not_create_project')));
    },
    _moveFile(item, node) {
        item.move(node)
            .then(() => {
                this.flash(item, 'Successfully moved');
                Ember.run.later(() => {
                    this.get('_items').removeObject(item);
                    this.notifyPropertyChange('_items');
                }, 1800);
                this.set('modalOpen', 'successMove');
                this.set('projectSelectState', 'main');
                this.set('willCreateComponent', false);
                this.send('track', 'move', 'track', 'Quick Files - Move to project');
            })
            .catch(() => this.get('toast').error(this.get('i18n').t('move_to_project.could_not_move_file')))
            .then(() => this.set('isMoving', false));
    },
});
