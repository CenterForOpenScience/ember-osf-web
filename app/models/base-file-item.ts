import { attr } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { or } from '@ember-decorators/object/computed';
import { Link } from 'jsonapi-typescript';

import { addQueryParam } from 'ember-osf-web/utils/url-parts';
import OsfModel, { OsfLinks } from './osf-model';

enum FileItemKinds {
    File = 'file',
    Folder = 'folder',
}

export interface BaseFileLinks extends OsfLinks {
    upload: Link;
    // only for folders
    new_folder?: Link; // eslint-disable-line camelcase
}

/**
 * File-like models are `node`, `file-provider`, and `file`/folder.
 * This model provides a polymorphic interface for file-like items.
 */
export default class BaseFileItem extends OsfModel {
    @attr() links!: BaseFileLinks;
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

    async createFolder(newFolderName: string): Promise<unknown> {
        if (this.isFile) {
            return Promise.reject(Error('Can only create subfolders inside a folder.'));
        }

        const newFolderLink = this.links.new_folder as string;
        const response = await this.currentUser.authenticatedAJAX({
            url: addQueryParam(newFolderLink, 'name', newFolderName),
            type: 'PUT',
            xhrFields: {
                withCredentials: true,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { path } = response.data.attributes;
        const id = path.replace(/\//g, '');

        return this.store.findRecord('file', id);
    }
}
