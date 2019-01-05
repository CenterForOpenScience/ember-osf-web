import { attr } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { or } from '@ember-decorators/object/computed';

import OsfModel from './osf-model';

enum FileItemKinds {
    File = 'file',
    Folder = 'folder',
}

/**
 * File-like models are `node`, `file-provider`, and `file`/folder.
 * This model provides a polymorphic interface for file-like items.
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
    get isFolder() {
        return this.isFileModel && this.kind === FileItemKinds.Folder;
    }

    @computed('isFileModel', 'kind')
    get isFile() {
        return this.isFileModel && this.kind === FileItemKinds.File;
    }
}
