import Component from '@ember/component';
import { computed } from '@ember/object';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display information about one revision of a file
 *
 * Sample usage:
 * ```handlebars
 * {{file-version
 * version=version
 * download='download'
 * currentVersion=currentVersion
 * versionUrl='versionUrl'}}
 * ```
 * @class file-version
 */
export default Component.extend({
    classNames: ['file-version'],
    tagName: 'tr',
    currentVersion: null,
    versionUrl: null,

    clickable: computed('version', 'currentVersion', function() {
        return this.get('version.id') !== this.get('currentVersion');
    }),

    actions: {
        downloadVersion(version) {
            this.attrs.download(version);
        },
        changeVersion(version) {
            this.attrs.versionChange(version);
        },
    },
});
