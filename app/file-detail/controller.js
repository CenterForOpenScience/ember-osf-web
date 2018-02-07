import $ from 'jquery';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { mimeTypes } from 'ember-osf/const/mime-types';
import mime from 'npm:mime-types';
import Analytics from 'ember-osf/mixins/analytics';
import config from 'ember-get-config';
import pathJoin from 'ember-osf/utils/path-join';

export default Controller.extend(Analytics, {
    currentUser: service(),
    toast: service(),
    queryParams: ['show'],

    show: 'view',
    revision: null,
    deleteModalOpen: false,
    lookupTable: {
        view: {
            edit: 'view_edit',
            revision: 'revision',
        },
        edit: {
            view: 'view_edit',
            revision: 'revision',
        },
        view_edit: {
            view: 'edit',
            edit: 'view',
            revision: 'revision',
        },
        revision: {
            view: 'view',
            edit: 'edit',
            revision: 'view',
        },
    },
    displays: A([]),

    searchUrl: pathJoin(config.OSF.url, 'search'),

    canDelete: computed.alias('canEdit'),

    canEdit: computed('currentUser', 'model.user', function() {
        if (!this.get('model.user.id')) return false;
        return (this.get('model.user.id') === this.get('currentUser.currentUserId'));
    }),

    mfrVersion: computed('model.file.currentVersion', 'revision', function() {
        return this.get('revision') ? this.get('revision') : this.get('model.file.currentVersion');
    }),


    fileTags: computed('model.file', function() {
        return this.get('model.file.tags');
    }),

    fileVersions: computed('model.file.currentVersion', function() {
        return $.getJSON(`${this.get('model.file.links.download')}?revisions=&`).then(this._returnFileVersion.bind(this));
    }),

    isEditableFile: computed('model.file.name', function() {
        $.extend(mime.types, mimeTypes);
        return /^text\//.test(mime.lookup(this.get('model.file.name')));
    }),

    fileText: computed('model.file.currentVersion', function() {
        return this.get('model.file').getContents();
    }),

    actions: {
        download(version) {
            const url = `${this.get('model.file.links.download')}?revision=${version}`;
            window.location = url;
        },

        delete() {
            this.set('deleteModalOpen', false);
            this.get('model.file').destroyRecord()
                .then(this._handleDeleteSuccess.bind(this))
                .catch(this._handleDeleteFail.bind(this));
        },

        openDeleteModal() {
            this.set('deleteModalOpen', true);
        },

        closeDeleteModal() {
            this.set('deleteModalOpen', false);
        },

        changeView(button) {
            if (this.get('lookupTable')[this.get('show')][button]) {
                this.set('show', this.get('lookupTable')[this.get('show')][button]);
            }
        },

        save(text) {
            this.get('model.file').updateContents(text)
                .then(this._handleSaveSuccess.bind(this))
                .catch(this._handleSaveFail.bind(this));
        },

        openFile(file) {
            if (file.get('guid')) {
                this.transitionToRoute('file-detail', file.get('guid'), { queryParams: { show: 'view' } });
            } else {
                file.getGuid().then(() => this.transitionToRoute('file-detail', file.get('guid'), { queryParams: { show: 'view' } }));
            }
            this.set('revision', null);
        },

        addTag(tag) {
            const model = this.get('model.file');
            this.get('fileTags').pushObject(tag);
            model.set('tags', this.get('fileTags'));
            model.save();
        },

        removeTagAtIndex(index) {
            const model = this.get('model.file');
            this.get('fileTags').removeAt(index);
            model.set('tags', this.get('fileTags'));
            model.save();
        },

        versionChange(version) {
            this.set('revision', version);
        },
    },

    _returnFileVersion(result) {
        return result.data;
    },

    _handleDeleteSuccess() {
        this.transitionToRoute('user-quickfiles', this.get('model.user.id'));
        return this.get('toast').success('File deleted');
    },

    _handleDeleteFail() {
        return this.get('toast').error('Error, unable to delete file');
    },

    _handleSaveSuccess() {
        return this.get('toast').success('File saved');
    },

    _handleSaveFail() {
        return this.get('toast').error('Error, unable to save file');
    },

});
