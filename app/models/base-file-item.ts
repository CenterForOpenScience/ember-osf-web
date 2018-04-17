import { attr } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { or } from '@ember-decorators/object/computed';
import { get } from '@ember/object';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule mixins
 */

enum FileItemKinds {
    File = 'file',
    Folder = 'folder',
}

/**
 * File-like models are `node`, `file-provider`, and `file`/folder.
 * This mixin provides a polymorphic interface for file-like items, and is intended to be used with models.
 *
 * @class FileItemMixin
 * @extends Ember.Mixin
 */

export default class FileItemMixin extends OsfModel {
    @attr('fixstring') kind: FileItemKinds | undefined;

    // Override in subclasses to set `true` when appropriate
    isNode = false;
    isProvider = false;
    isFileModel = false;

    @or('name', 'title') itemName;
    @or('isNode', 'isProvider', 'isFolder') canHaveChildren;

    @computed('isFileModel', 'kind')
    get isFolder(this: FileItemMixin) {
        return get(this, 'isFileModel') && get(this, 'kind') === FileItemKinds.Folder;
    }

    @computed('isFileModel', 'kind')
    get isFile(this: FileItemMixin) {
        return get(this, 'isFileModel') && get(this, 'kind') === FileItemKinds.File;
    }
}
