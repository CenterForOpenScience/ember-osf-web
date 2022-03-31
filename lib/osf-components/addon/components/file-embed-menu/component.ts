import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import FileModel from 'ember-osf-web/models/file';

interface Args {
    file: FileModel;
}

export default class FileEmbedMenuComponent extends Component<Args>{

    @service toast!: Toast;
    @service intl!: Intl;

    get shareiFrameDynamic() {
        const mfrStaticUrl = config.OSF.renderUrl.replace('/render', '/static');

        return htmlSafe(`<style>
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
        var mfrRender = new mfr.Render("mfrIframe", "${this.args.file.links.render}");
    }
    if (window.$) {
        renderMfr();
    } else {
        var jq = document.createElement('script');
        document.head.appendChild(jq);
        jq.onload = function() {
            renderMfr();
        }
        jq.src = 'http://code.jquery.com/jquery-1.11.2.min.js';
    }
</script>`);
    }

    get shareiFrameDirect() {
        return htmlSafe(`<iframe src="${this.args.file.links.render}"
    width="100%"
    scrolling="yes"
    height="677px"
    marginheight="0"
    frameborder="0"
    allowfullscreen
    webkitallowfullscreen
>`);
    }

    @action successMessage(){
        this.toast.success(this.intl.t('file_actions_menu.success_message'));
    }

    @action errorMessage(){
        this.toast.error(this.intl.t('file_actions_menu.error_message'));
    }
}
