import { classNames, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import template from './template';

/**
 * @module ember-osf
 * @submodule components
 */

export interface Version {
    id: string;
    attributes: {
        extra: {
            hashes: {
                md5: string;
                sha256: string;
            },
        },
    };
}

/**
 * Display information about one revision of a file
 *
 * Sample usage:
 * ```handlebars
 * {{file-version
 * version=version
 * download='download'
 * currentVersion=currentVersion}}
 * ```
 * @class FileVersion
 */
@layout(template, styles)
@tagName('tr')
@classNames('file-version')
export default class FileVersion extends Component {
    @service analytics!: Analytics;

    currentVersion!: number;
    version!: Version;

    @computed('version.id', 'currentVersion')
    get clickable(): boolean {
        return +this.version.id !== this.currentVersion;
    }

    @requiredAction download!: (version: Version) => void;
    @requiredAction versionChange!: (version: Version) => void;

    @action
    downloadVersion(version: Version): void {
        this.download(version);
    }

    @action
    changeVersion(version: Version): void {
        this.versionChange(version);
    }
}
