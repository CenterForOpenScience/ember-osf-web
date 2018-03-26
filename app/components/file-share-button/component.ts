import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import Ember from 'ember';
import config from 'ember-get-config';
import pathJoin from 'ember-osf-web/utils/path-join';

const {
    social: {
        twitter: {
            viaHandle: via,
        },
    },
} = config;

export default class FileShareButton extends Component.extend({
    analytics: Ember.inject.service(),
    actions: {
        share(this: FileShareButton) {
            const textArea: HTMLTextAreaElement = document.querySelector('.SharePane__mfr-url');
            textArea.select();
            document.execCommand('copy');
        },

        togglePopup(this: FileShareButton) {
            this.toggleProperty('showPopup');
        },

        hidePopup(this: FileShareButton) {
            this.set('showPopup', false);
        },
    },
}) {
    file: any; // Change when models are typed
    showPopup = false;

    popoverClass = computed('styleNamespace', function() {
        return `${this.get('styleNamespace')}__popover`;
    });

    sharePaneId = computed('elementId', function() {
        return `${this.get('elementId')}__share-pane`;
    });

    embedPaneId = computed('elementId', function() {
        return `${this.get('elementId')}__embed-pane`;
    });

    fileUrl = computed('file', function() {
        return pathJoin(config.OSF.url, this.get('file.guid'));
    });

    twitterUrl = computed('file.name', 'fileUrl', function() {
        const params = {
            text: this.get('file.name'),
            url: this.get('fileUrl'),
            via,
        };

        return `https://twitter.com/intent/tweet?${$.param(params)}`;
    });

    facebookUrl = computed('fileUrl', function() {
        const params = {
            u: this.get('fileUrl'),
        };

        return `https://www.facebook.com/sharer/sharer.php?${$.param(params)}`;
    });

    linkedInUrl = computed('file.name', 'fileUrl', function() {
        const params = {
            title: this.get('file.name'),
            url: this.get('fileUrl'),
        };

        return `https://www.linkedin.com/cws/share?${$.param(params)}`;
    });

    emailUrl = computed('file.name', 'fileUrl', function() {
        const params = {
            body: this.get('fileUrl'),
            subejct: this.get('file.name'),
        };

        return `mailto:?${$.param(params)}`;
    });

    mfrUrl = computed('file', function() {
        const file = this.get('file');

        const params = {
            url: pathJoin(config.OSF.url, file.get('guid'), 'download'),
        };

        return `${config.OSF.renderUrl}?${$.param(params)}`;
    });

    shareiFrameDynamic = computed('mfrUrl', function() {
        const mfrStaticUrl = config.OSF.renderUrl.replace('/render', '/static');

        return htmlSafe(`
            <style>
                .embed-responsive {
                    position:relative;
                    height:100%;
                }
                .embed-responsive iframe {
                    position:absolute;
                    height:100%;
                }
            </style>
            <link href="${mfrStaticUrl}/css/mfr.css" media="all" rel="stylesheet">
            <div id="mfrIframe" class="mfr mfr-file"></div>
            <script src="${mfrStaticUrl}/js/mfr.js"></script>
            <script>
                function renderMfr() {
                    var mfrRender = new mfr.Render("mfrIframe", "${this.get('mfrUrl')}");
                }
                if (window.jQuery) {
                    renderMfr();
                } else {
                    var jq = document.createElement('script');
                    document.head.appendChild(jq);
                    jq.onload = function() {
                        renderMfr();
                    }
                    jq.src = 'http://code.jquery.com/jquery-1.11.2.min.js';
                }
            </script>
        `.trim().replace(/^\s{12}/mg, ''));
    });

    shareiFrameDirect = computed('mfrUrl', function() {
        return htmlSafe(`
            <iframe src="${this.get('mfrUrl')}"
                    width="100%"
                    scrolling="yes"
                    height="677px"
                    marginheight="0"
                    frameborder="0"
                    allowfullscreen
                    webkitallowfullscreen>
        `.trim().replace(/^\s{12}/mg, ''));
    });
}
