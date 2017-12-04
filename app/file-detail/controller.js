import $ from 'jquery';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { mimeTypes } from 'ember-osf/const/mime-types';
import outsideClick from 'ember-osf/utils/outside-click';
import mime from 'npm:mime-types';
import Analytics from 'ember-osf/mixins/analytics';
import config from 'ember-get-config';
import pathJoin from 'ember-osf/utils/path-join';

export default Controller.extend(Analytics, {
    currentUser: service(),
    toast: service(),
    queryParams: ['show'],
    show: null,
    revision: null,
    deleteModalOpen: false,
    showPopup: false,
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

    fileUrl: computed('model.file', function() {
        return encodeURIComponent(window.location.href);
    }),

    twitterUrl: computed('model.file', 'fileUrl', function() {
        return `https://twitter.com/intent/tweet?url=${this.get('fileUrl')}&text=${this.get('model.file.name')}&via=OSFramework`;
    }),

    facebookUrl: computed('model.file', 'fileUrl', function() {
        return `https://www.facebook.com/sharer/sharer.php?u=${this.get('fileUrl')}`;
    }),

    linkedInUrl: computed('model.file', 'fileUrl', function() {
        return `https://www.linkedin.com/cws/share?url=${this.get('fileUrl')}&title=${this.get('model.file.name')}`;
    }),

    emailUrl: computed('model.file', 'fileUrl', function() {
        return `mailto:?subject=${this.get('model.file.name')}&body=${this.get('fileUrl')}`;
    }),

    mfrUrl: computed('model.file', function() {
        return `https://mfr.osf.io/render?url=${window.location.href}?action=download%26mode=render`;
    }),

    shareiFrameDynamic: computed('model.file', function() {
        return `<style>.embed-responsive{position:relative;height:100%;}.embed-responsive iframe{position:absolute;height:100%;}</style><script>window.jQuery || document.write('<script src="//code.jquery.com/jquery-1.11.2.min.js">\x3C/script>') </script><link href="https://mfr.osf.io/static/css/mfr.css" media="all" rel="stylesheet"><div id="mfrIframe" class="mfr mfr-file"></div><script src="https://mfr.osf.io/static/js/mfr.js"></script> <script>var mfrRender = new mfr.Render("mfrIframe", "${this.get('mfrUrl')}");</script>`;
    }),

    shareiFrameDirect: computed('model.file', function() {
        return `<iframe src="${this.get('mfrUrl')}" width="100%" scrolling="yes" height="677px" marginheight="0" frameborder="0" allowfullscreen webkitallowfullscreen>`;
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
        share() {
            document.querySelector('#sharePaneUrl').select();
            document.execCommand('copy');
        },

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

        togglePopup() {
            this.toggleProperty('showPopup');
        },

        dismissToggle() {
            this.set('showPopup', false);
        },
    },

    init() {
        this._super(...arguments);
        outsideClick(function() {
            this.send('dismissToggle');
        }.bind(this));

        $(window).resize(function() {
            this.send('dismissToggle');
        }.bind(this));
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
