import Ember from 'ember';


export default Ember.Controller.extend({
    displays: Ember.A([]),

    userId: Ember.computed('model', function() {
        return this.get('model.user');
    }),
    fileTags: Ember.computed('model', function() {
        return this.get('model.tags');
    }),
    fileUrl: Ember.computed('model', function() {
        return encodeURIComponent(window.location.href);
    }),
    twitterUrl: Ember.computed('model', 'fileUrl', function() {
        return 'https://twitter.com/intent/tweet?url=' + this.get('fileUrl') + '&text=' + this.get('model.name') + '&via=OSFramework';
    }),
    facebookUrl: Ember.computed('model', 'fileUrl', function() {
        return 'https://www.facebook.com/sharer/sharer.php?u=' + this.get('fileUrl');
    }),
    linkedInUrl: Ember.computed('model', 'fileUrl', function() {
        return 'https://www.linkedin.com/cws/share?url=' + this.get('fileUrl') + '&title=' + this.get('model.name');
    }),
    emailUrl: Ember.computed('model', 'fileUrl', function() {
        return 'mailto:?subject=' + this.get('model.name') + '&body=' + this.get('fileUrl');
    }),
    mfrUrl: Ember.computed('model', function() {
        return 'https://mfr.osf.io/render?url=' + window.location.href + '?action=download%26mode=render';
    }),
    shareiFrameDynamic: Ember.computed('model', function() {
        return '<style>.embed-responsive{position:relative;height:100%;}.embed-responsive iframe{position:absolute;height:100%;}</style><script>window.jQuery || document.write(\'<script src="//code.jquery.com/jquery-1.11.2.min.js">\x3C/script>\') </script><link href="https://mfr.osf.io/static/css/mfr.css" media="all" rel="stylesheet"><div id="mfrIframe" class="mfr mfr-file"></div><script src="https://mfr.osf.io/static/js/mfr.js"></script> <script>var mfrRender = new mfr.Render("mfrIframe", "' + this.get('mfrUrl') + '");</script>';
    }),
    shareiFrameDirect: Ember.computed('model', function() {
        return '<iframe src="' + this.get('mfrUrl') + '" width="100%" scrolling="yes" height="677px" marginheight="0" frameborder="0" allowfullscreen webkitallowfullscreen>';
    }),
    fileVersions: Ember.computed('model', function() {
        let versionId = this.get('model.versions.content.record._data.guid');
        let versionSize = this.get('model.versions.content.record._data.size');

        let versionArray = {'id': versionId, 'size': versionSize};
        debugger;
        return versionArray;
    }),

    actions: {
        share() {
            document.querySelector("#sharePaneUrl").select();
            document.execCommand('copy');    
        },

        download() {
            window.location = this.get('model.links.download');
        },

        changeView() {
            Ember.$('#mfrIframeParent').toggle();
            Ember.$('#revisionsPanel').toggle();
            Ember.$('.view-button').toggleClass('btn-default btn-primary');
        },

        openFile(file) {
            let fileID = file.get('guid') ? file.get('guid') : file.id;
            this.transitionToRoute('file-detail', fileID);
        }
    }
});
