import { classNames, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import eatArgs from 'ember-osf-web/utils/eat-args';
import styles from './styles';
import layout from './template';

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
@tagName('tr')
@classNames('file-version')
export default class FileVersion extends Component {
    layout = layout;
    styles = styles;

    currentVersion!: number;
    version!: Version;

    @computed('version.id', 'currentVersion')
    get clickable(): boolean {
        return +this.version.id !== this.currentVersion;
    }

    /**
     * Placeholder for closure action: download
     */
    download(version: Version): void {
        eatArgs(version);
        assert('You should pass in a closure action: download');
    }

    /**
     * Placeholder for closure action: versionChange
     */
    versionChange(version: Version): void {
        eatArgs(version);
        assert('You should pass in a closure action: versionChange');
    }

    @action
    downloadVersion(version: Version): void {
        this.download(version);
    }

    @action
    changeVersion(version: Version): void {
        this.versionChange(version);
    }
}
