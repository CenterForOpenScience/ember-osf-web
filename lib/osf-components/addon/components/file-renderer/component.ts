import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import config from 'ember-get-config';
import $ from 'jquery';
import Media from 'ember-responsive';
import File from 'ember-osf-web/models/file';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

const { OSF: { renderUrl } } = config;

interface Params {
    direct?: '';
    mode: 'render';
    version?: number;
}

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
@layout(template)
export default class FileRenderer extends Component {
    @service media!: Media;

    get isMobile() {
        return this.media.isMobile;
    }

    params: Params = {
        direct: '',
        mode: 'render',
    };

    download?: string;
    lastDownload?: string;
    width = '100%';
    height = '100%';
    allowfullscreen = true;
    version?: number;
    isLoading = true;
    file?: File;

    getFileName(): string {
        return this.file!.name;
    }

    @computed('download', 'params', 'version')
    get downloadUrl(): string {
        const { download, params, version } = this;

        return `${download}?${$.param({ ...params, ...(version ? { version } : {}) })}`;
    }

    @computed('downloadUrl', 'isLoading')
    get mfrUrl(): string {
        // Waiting until the iframe is loaded then changing the URL avoids a race condition in the MFR iframe
        // This is most apparent in 3D files
        return this.isLoading ? '' : `${renderUrl}?url=${encodeURIComponent(this.downloadUrl)}`;
    }

    didReceiveAttrs(): void {
        if (this.download !== this.lastDownload) {
            this.set('lastDownload', this.download);
        }
    }

    @action
    loaded(): void {
        if (this.isLoading) {
            // Run in next runloop to avoid double rendering
            next(this, () => this.set('isLoading', false));
        }
    }
}
