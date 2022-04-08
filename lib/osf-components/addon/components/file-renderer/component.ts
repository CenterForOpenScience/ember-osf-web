import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { next } from '@ember/runloop';
import config from 'ember-get-config';

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
@tagName('')
@layout(template)
export default class FileRenderer extends Component {
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

    @computed('download', 'params', 'version')
    get downloadUrl(): string {
        const { download, params, version } = this;
        if (!download) {
            return '';
        }
        const downloadLink = new URL(download);
        downloadLink.searchParams.set('direct', params.direct || '');
        downloadLink.searchParams.set('mode', params.mode);
        downloadLink.searchParams.set('version', version?.toString() || '');
        return downloadLink.toString();
    }

    @computed('downloadUrl', 'isLoading')
    get mfrUrl(): string {
        // Waiting until the iframe is loaded then changing the URL avoids a race condition in the MFR iframe
        // This is most apparent in 3D files
        const urlWithParams = new URL(renderUrl);
        urlWithParams.searchParams.set('url', this.downloadUrl);
        return this.isLoading ? '' : urlWithParams.toString();
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
