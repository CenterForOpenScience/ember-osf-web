import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { next } from '@ember/runloop';
import config from 'ember-get-config';
import $ from 'jquery';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
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
    params: Params = {
        direct: '',
        mode: 'render',
    };

    download?: string;
    lastDownload?: string;
    width: string = defaultTo(this.width, '100%');
    height: string = defaultTo(this.height, '100%');
    allowfullscreen: boolean = defaultTo(this.allowfullscreen, true);
    version?: number;
    isLoading: boolean = true;

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

    didReceiveAttrs(this: FileRenderer): void {
        if (this.download !== this.lastDownload) {
            this.set('lastDownload', this.download);
        }
    }

    @action
    loaded(this: FileRenderer): void {
        if (this.isLoading) {
            // Run in next runloop to avoid double rendering
            next(this, () => this.set('isLoading', false));
        }
    }
}
