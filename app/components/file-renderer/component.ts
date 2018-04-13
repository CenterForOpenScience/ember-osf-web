import { action, computed } from '@ember-decorators/object';
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
    lastDownload: string;
    width: string = defaultTo(this.width, '100%');
    height: string = defaultTo(this.height, '100%');
    allowfullscreen: boolean = defaultTo(this.allowfullscreen, true);
    version: string | null = defaultTo(this.version, null);
    isLoading: boolean = true;

    @computed('download', 'version')
    get mfrUrl(this: FileRenderer) {
        let download = `${this.download}?direct&mode=render&initialWidth=766`;
        if (this.version) {
            download += `&version=${this.version}`;
        }
        return `${config.OSF.renderUrl}?url=${encodeURIComponent(download)}`;
    }

    didReceiveAttrs(this: FileRenderer) {
        if (this.download !== this.lastDownload) {
            this.set('isLoading', true);
            this.set('lastDownload', this.download);
        }
    }

    @action
    loaded(this: FileRenderer) {
        this.set('isLoading', false);
    }
}
