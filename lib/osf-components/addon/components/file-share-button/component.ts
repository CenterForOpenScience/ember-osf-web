import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';
import styles from './styles';
import template from './template';

const {
    social: {
        twitter: {
            viaHandle: via,
        },
    },
} = config;

@layout(template, styles)
export default class FileShareButton extends Component {
    @service analytics!: Analytics;

    file?: File;
    showPopup = false;
    elementId!: string;

    @computed('elementId')
    get sharePaneId() {
        return `${this.elementId}__share-pane`;
    }

    @computed('elementId')
    get embedPaneId() {
        return `${this.elementId}__embed-pane`;
    }

    @computed('file')
    get fileUrl() {
        return this.file ? pathJoin(config.OSF.url, this.file.guid) : '';
    }

    @computed('file.name', 'fileUrl')
    get twitterUrl() {
        if (!this.file) {
            return undefined;
        }

        const params = {
            text: this.file.name,
            url: this.fileUrl,
            via,
        };

        return `https://twitter.com/intent/tweet?${$.param(params)}`;
    }

    @computed('fileUrl')
    get facebookUrl() {
        const params = {
            u: this.fileUrl,
        };

        return `https://www.facebook.com/sharer/sharer.php?${$.param(params)}`;
    }

    @computed('file.name', 'fileUrl')
    get linkedInUrl() {
        if (!this.file) {
            return undefined;
        }

        const params = {
            title: this.file.name,
            url: this.fileUrl,
        };

        return `https://www.linkedin.com/cws/share?${$.param(params)}`;
    }

    @computed('file.name', 'fileUrl')
    get emailUrl() {
        if (!this.file) {
            return undefined;
        }

        const params = {
            body: this.fileUrl,
            subejct: this.file.name,
        };

        return `mailto:?${$.param(params)}`;
    }

    @computed('file')
    get mfrUrl() {
        if (!this.file) {
            return undefined;
        }

        const params = {
            url: pathJoin(config.OSF.url, this.file.guid, 'download'),
        };

        return `${config.OSF.renderUrl}?${$.param(params)}`;
    }

    @computed('mfrUrl')
    get shareiFrameDynamic() {
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
                    var mfrRender = new mfr.Render("mfrIframe", "${this.mfrUrl}");
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
    }

    @computed('mfrUrl')
    get shareiFrameDirect() {
        return htmlSafe(`
            <iframe src="${this.mfrUrl}"
                    width="100%"
                    scrolling="yes"
                    height="677px"
                    marginheight="0"
                    frameborder="0"
                    allowfullscreen
                    webkitallowfullscreen>
        `.trim().replace(/^\s{12}/mg, ''));
    }

    @action
    togglePopup() {
        this.toggleProperty('showPopup');
    }

    @action
    hidePopup(this: FileShareButton) {
        this.set('showPopup', false);
    }
}
