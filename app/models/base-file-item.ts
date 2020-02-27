import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import DS from 'ember-data';
import { Link } from 'jsonapi-typescript';

import getHref from 'ember-osf-web/utils/get-href';
import { addQueryParam } from 'ember-osf-web/utils/url-parts';
import OsfModel, { OsfLinks } from './osf-model';

const { attr } = DS;

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

    async createFolder(newFolderName: string): Promise<{ newFolderId: string }> {
        const {
            isFolder,
            isProvider,
            links: { new_folder: newFolderLink },
        } = this;

        if (!isFolder && !isProvider) {
            throw Error('Can only create subfolders inside a folder.');
        }

        assert('Could not find new_folder link', Boolean(newFolderLink));

        const link = getHref(newFolderLink!);
        const response = await this.currentUser.authenticatedAJAX({
            url: addQueryParam(link, 'name', newFolderName),
            type: 'PUT',
        });

        const { path } = response.data.attributes;
        // WB response path /<object_id>/ for OsfStorage folders.
        // Change when we support other storage addons.
        const newFolderId = path.replace(/\//g, '');

        return { newFolderId };
    }
}
