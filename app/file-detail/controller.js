import $ from 'jquery';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import Controller from '@ember/controller';

export default Controller.extend({
    currentUser: service(),
    revision: null,
    displays: A([]),

    mfrVersion: computed('model.file', 'revision', function() {
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

    fileVersions: computed('model.file', function() {
        return $.getJSON(`${this.get('model.file.links.download')}?revisions=&`).then(this._returnFileVersion.bind(this));
    }),

    edit: computed('currentUser', 'model.user', function() {
        let _edit = false;
        if (this.get('model.user.id')) {
            _edit = (this.get('model.user.id') === this.get('currentUser.currentUserId'));
        }
        return _edit;
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

        changeView() {
            $('#mfrIframeParent').toggle();
            $('#revisionsPanel').toggle();
            $('.view-button').toggleClass('btn-default btn-primary');
        },

        openFile(file) {
            const fileID = file.get('guid') ? file.get('guid') : file.id;
            this.transitionToRoute('file-detail', fileID);
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
