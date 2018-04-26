import { attr } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { or } from '@ember-decorators/object/computed';
import { get } from '@ember/object';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

enum FileItemKinds {
    File = 'file',
    Folder = 'folder',
}

/**
 * File-like models are `node`, `file-provider`, and `file`/folder.
 * This model provides a polymorphic interface for file-like items.
 *
 * @class BaseFileItem
 * @extends OsfModel
 */

export default class BaseFileItem extends OsfModel {
    @attr('fixstring') kind?: FileItemKinds;

    // Override in subclasses to set `true` when appropriate
    isNode = false;
    isProvider = false;
    isFileModel = false;

    @or('name', 'title') itemName!: string;
    @or('isNode', 'isProvider', 'isFolder') canHaveChildren!: boolean;

    @computed('isFileModel', 'kind')
    get isFolder(this: BaseFileItem): boolean {
        return get(this, 'isFileModel') && get(this, 'kind') === FileItemKinds.Folder;
    }

    @computed('isFileModel', 'kind')
    get isFile(this: BaseFileItem) {
        return get(this, 'isFileModel') && get(this, 'kind') === FileItemKinds.File;
    }
}
