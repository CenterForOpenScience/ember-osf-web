import Ember from 'ember';
import layout from './template';

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
export default Ember.Component.extend({
    layout,
    classNames: ['file-version'],
    tagName: 'tr',
    currentVersion: null,
    versionUrl: null,

    clickable: Ember.computed('version', 'currentVersion', function() {
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
