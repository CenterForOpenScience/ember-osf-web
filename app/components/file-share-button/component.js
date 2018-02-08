import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import Analytics from 'ember-osf/mixins/analytics';
import config from 'ember-get-config';
import pathJoin from 'ember-osf/utils/path-join';

export default Component.extend(Analytics, {
    // -- Component arguments -- //
    file: null,

    // -- Class properties -- //
    showPopup: false,

    // -- Computed properties -- //
    popoverClass: computed('styleNamespace', function() {
        return `${this.get('styleNamespace')}__popover`;
    }),

    sharePaneId: computed('elementId', function() {
        return `${this.get('elementId')}__share-pane`;
    }),

    embedPaneId: computed('elementId', function() {
        return `${this.get('elementId')}__embed-pane`;
    }),

    fileUrl: computed('file', function() {
        return encodeURIComponent(pathJoin(config.OSF.url, this.get('file.guid')));
    }),

    twitterUrl: computed('file.name', 'fileUrl', function() {
        return `https://twitter.com/intent/tweet?url=${this.get('fileUrl')}&text=${this.get('file.name')}&via=OSFramework`;
    }),

    facebookUrl: computed('fileUrl', function() {
        return `https://www.facebook.com/sharer/sharer.php?u=${this.get('fileUrl')}`;
    }),

    linkedInUrl: computed('file.name', 'fileUrl', function() {
        return `https://www.linkedin.com/cws/share?url=${this.get('fileUrl')}&title=${this.get('file.name')}`;
    }),

    emailUrl: computed('file.name', 'fileUrl', function() {
        return `mailto:?subject=${this.get('file.name')}&body=${this.get('fileUrl')}`;
    }),

    mfrUrl: computed('file', function() {
        const encodedDownloadUrl = encodeURIComponent(pathJoin(config.OSF.url, this.get('file.guid'), 'download'));
        return `${config.OSF.renderUrl}?url=${encodedDownloadUrl}`;
    }),

    shareiFrameDynamic: computed('mfrUrl', function() {
        return htmlSafe(`<style>.embed-responsive{position:relative;height:100%;}.embed-responsive iframe{position:absolute;height:100%;}</style><script>window.jQuery || document.write('<script src="//code.jquery.com/jquery-1.11.2.min.js">\x3C/script>') </script><link href="https://mfr.osf.io/static/css/mfr.css" media="all" rel="stylesheet"><div id="mfrIframe" class="mfr mfr-file"></div><script src="https://mfr.osf.io/static/js/mfr.js"></script> <script>var mfrRender = new mfr.Render("mfrIframe", "${this.get('mfrUrl')}");</script>`);
    }),

    shareiFrameDirect: computed('mfrUrl', function() {
        return htmlSafe(`<iframe src="${this.get('mfrUrl')}" width="100%" scrolling="yes" height="677px" marginheight="0" frameborder="0" allowfullscreen webkitallowfullscreen>`);
    }),

    actions: {
        share() {
            document.querySelector('.SharePane__mfr-url').select();
            document.execCommand('copy');
        },

        togglePopup() {
            this.toggleProperty('showPopup');
        },

        hidePopup() {
            this.set('showPopup', false);
        },
    },
});
