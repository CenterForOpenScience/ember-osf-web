import $ from 'jquery';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { authenticatedAJAX } from 'ember-osf/utils/ajax-helpers';
import { mimeTypes } from 'ember-osf/const/mime-types';

export default Controller.extend({
    currentUser: service(),
    toast: service(),
    revision: null,
    openModal: false,
    displays: A([]),

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

    edit: computed('currentUser', 'model.user', function() {
        if (!this.get('model.user.id')) return false;
        return (this.get('model.user.id') === this.get('currentUser.currentUserId'));
    }),

    isEditableFile: computed('model.file', function() {
        const fileName = this.get('model.file.name');
        const fileExtension = fileName.split('.').pop();
        if (fileExtension in mimeTypes) return true;
        return false;
    }),

    fileText: computed('model.file', function() {
        return authenticatedAJAX({
            url: this.get('model.file.links.download'),
            type: 'GET',
            xhrFields: { withCredentials: true },
        }).done((data) => {
            return data;
        });
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
            authenticatedAJAX({
                url: this.get('model.file.links.download'),
                type: 'DELETE',
                xhrFields: { withCredentials: true },
            }).done(() => {
                this.set('openModal', false);
                this.transitionToRoute('user-quickfiles', this.get('model.user.id'));
            });
        },

        showModal() {
            this.set('openModal', true);
        },

        closeModal() {
            this.set('openModal', false);
        },

        changeViewPanel(panel, button) {
            if (!this.get('isEditableFile')) {
                $('#mainViewBtn, #revisionBtn').toggleClass('btn-primary btn-default');
                $('#mfrIframeParent, #revisionsPanel').toggle();
                return;
            }

            if (button === 'revisionBtn' && $(`#${panel}`).css('display') === 'none') {
                $('.panel-view').hide().removeClass('col-sm-6');
                $('.view-button').removeClass('btn-primary').addClass('btn-default');
                $(`#${panel}`).toggle();
                $(`#${button}`).toggleClass('btn-default btn-primary');
                return;
            } else if (button === 'revisionBtn') {
                $('#mfrIframeParent').toggle();
                $('#mainViewBtn').toggleClass('btn-default btn-primary');
                $(`#${panel}`).toggle();
                $(`#${button}`).toggleClass('btn-default btn-primary');
                return;
            }

            if ($(`#${button}`).hasClass('btn-primary') && $('.view-button.btn-primary').length === 1) {
                return;
            } else if ($('#revisionsPanel').css('display') !== 'none') {
                $('#revisionsPanel').toggle();
                $('#revisionBtn').toggleClass('btn-default btn-primary');
            } else if ($('#mfrIframeParent').css('display') !== 'none' || $('#editPanel').css('display') !== 'none') {
                $('.panel-view').toggleClass('col-sm-6');
            } else {
                $('.panel-view').removeClass('col-sm-6');
            }

            $(`#${panel}`).toggle();
            $(`#${button}`).toggleClass('btn-default btn-primary');
        },

        save(text) {
            const controller = this;
            authenticatedAJAX({
                url: this.get('model.file.links.upload'),
                type: 'PUT',
                xhrFields: { withCredentials: true },
                data: text,
            }).done(() => {
                controller.get('model.file').reload().then(
                    () => controller.set('revision', null),
                    this.get('toast').success('File saved'),
                );
            }).fail(() => {
                this.get('toast').error('Error, unable to save file');
            });
        },

        openFile(file) {
            if (file.get('guid')) {
                this.transitionToRoute('file-detail', file.get('guid'));
            } else {
                file.getGuid().then(() => this.transitionToRoute('file-detail', file.get('guid')));
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
    },

    _returnFileVersion(result) {
        return result.data;
    },
});
