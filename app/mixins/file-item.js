import Mixin from '@ember/object/mixin';
import { or, and, equal } from '@ember/object/computed';

/**
 * @module ember-osf-web
 * @submodule mixins
 */

/**
 * File-like models are `node`, `file-provider`, and `file`/folder.
 * This mixin provides a polymorphic interface for file-like items, and is intended to be used with models.
 *
 * @class FileItemMixin
 * @extends Ember.Mixin
 */
export default Mixin.create({
    itemName: or('name', 'title'),
    // https://github.com/emberjs/ember.js/issues/14014
    // isNode: equal('constructor.modelName', 'node'),
    // isProvider: equal('constructor.modelName', 'file-provider'),
    isNode: false,
    isProvider: false,
    isFolder: and('_isFileModel', '_isFolder'),
    isFile: and('_isFileModel', '_isFile'),
    canHaveChildren: or('isNode', 'isProvider', 'isFolder'),

    // _isFileModel: equal('constructor.modelName', 'file'),
    _isFileModel: false,
    _isFolder: equal('kind', 'folder'),
    _isFile: equal('kind', 'file'),
});
