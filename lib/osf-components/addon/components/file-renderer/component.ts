import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { next } from '@ember/runloop';
import config from 'ember-osf-web/config/environment';

import { layout } from 'ember-osf-web/decorators/component';
import { tracked } from 'tracked-built-ins';

import template from './template';

const { OSF: { renderUrl, mfrUrl } } = config;

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
    width = '100%';
    height = '100%';
    allowfullscreen = true;
    version?: number;
    allowCommenting = false;
    @tracked isLoading = true;

    @computed('download', 'params', 'version')
    get downloadUrl(): string {
        const { download, params, version } = this;
        if (!download) {
            return '';
        }
        const downloadLink = new URL(download);
        downloadLink.searchParams.set('direct', params.direct || '');
        downloadLink.searchParams.set('mode', params.mode);
        if (version) {
            downloadLink.searchParams.set('version', version.toString());
        }
        return downloadLink.toString();
    }

    @computed('downloadUrl', 'isLoading')
    get getMfrUrl(): string {
        // Waiting until the iframe is loaded then changing the URL avoids a race condition in the MFR iframe
        // This is most apparent in 3D files
        const urlWithParams = new URL(renderUrl);
        urlWithParams.searchParams.set('url', this.downloadUrl);
        if (config.WATER_BUTLER_ENABLED) {
            return this.isLoading ? '' : urlWithParams.toString();
        } else {
            return this.isLoading ? '' : this.downloadUrl;

        }
    }

    didReceiveAttrs(): void {
        this.isLoading = true;
    }

    @action
    loaded(): void {
        if (this.isLoading) {
            // Run in next runloop to avoid double rendering
            next(this, () => this.set('isLoading', false));
        }
    }

    private mfrOrigin(): string {
        const urlParts = mfrUrl.split('/');
        if (urlParts.length < 3) {
            // if unable to extract mfr origin, just return config mfrUrl
            return mfrUrl;
        }

        return `${urlParts[0]}//${urlParts[2]}`;
    }

    didRender() {
        if (this.allowCommenting) {
            const iframeElement = window.document.getElementsByTagName('iframe')[0];
            iframeElement.addEventListener('load', () => {
                iframeElement.contentWindow?.postMessage(
                    {type: 'startHypothesis', parentUrl: window.location.toString()},
                    this.mfrOrigin(),
                );
            });
        }
    }
}
