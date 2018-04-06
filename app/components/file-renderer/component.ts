import { action, computed } from '@ember-decorators/object';
import { not } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import config from 'ember-get-config';
import defaultTo from 'ember-osf-web/utils/default-to';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Render the provided url in an iframe via MFR
 *
 * Sample usage:
 * ```handlebars
 * {{file-renderer
 *   download=model.links.download
 *     width="800" height="1000" allowfullscreen=true}}
 * ```
 * @class FileRenderer
 */
export default class FileRenderer extends Component {
    download: string;
    width: string = defaultTo(this.width, '100%');
    height: string = defaultTo(this.height, '100%');
    allowfullscreen: boolean = defaultTo(this.allowfullscreen, true);
    version: string | null = defaultTo(this.version, null);
    showLoadingIndicator: boolean = defaultTo(this.showLoadingIndicator, true);

    @not('showLoadingIndicator') showIframe: boolean;

    @computed('download', 'version')
    get mfrUrl(this: FileRenderer) {
        let download = `${this.download}?direct&mode=render&initialWidth=766`;
        if (this.version) {
            download += `&version=${this.version}`;
        }
        return `${config.OSF.renderUrl}?url=${encodeURIComponent(download)}`;
    }

    @action
    loaded(this: FileRenderer) {
        this.set('showLoadingIndicator', false);
    }
}
