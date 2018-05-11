import { service } from '@ember-decorators/service';
import { run } from '@ember/runloop';
import Service from '@ember/service';
import DS from 'ember-data';
import File from 'ember-osf-web/models/file';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';
import Session from 'ember-simple-auth/services/session';
import $ from 'jquery';

interface WaterbutlerData {
    action?: 'copy' | 'move' | 'rename';
    rename?: string;
}

interface Options<T = string> {
    data?: T;
    query?: {
        name?: string; // eslint-disable-line no-restricted-globals
        kind?: 'file' | 'folder';
        zip?: string;
    };
}

/**
 * @module ember-osf
 * @submodule services
 */

/**
 * An Ember service for doing things to files.
 * Essentially a wrapper for the Waterbutler API.
 * http://waterbutler.readthedocs.io/
 *
 * @class file-manager
 * @extends Ember.Service
 */
export default class FileManager extends Service {
    @service session!: Session;
    @service store!: DS.Store;

    /**
     * Hash set of URLs for `model.reload()` calls that are still pending.
     *
     * @property reloadingUrls
     * @private
     */
    private reloadingUrls = new Set<string>();

    /**
     * Get a URL to download the given file.
     *
     * @method getDownloadUrl
     * @param {file} file A `file` model
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the URL.
     * @param {Object} [options.query.version] `file-version` ID
     * @return {String} Download URL
     */
    getDownloadUrl(file: File, options: Options = {}): string {
        const url = file.links.download;

        const { query = {} } = options;

        if (file.get('isFolder')) {
            query.zip = '';
        }

        const queryString = $.param(query);

        return `${url}${queryString ? `?${queryString}` : ''}`;
    }

    /**
     * Download the contents of the given file.
     *
     * @method getContents
     * @param {file} file A `file` model with `isFolder == false`.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the file contents or rejects
     * with an error message.
     */
    getContents(file: File, options: Options = {}): Promise<any> {
        const url = file.get('links').download;
        return this.waterbutlerRequest('GET', url, options);
    }

    /**
     * Upload a new version of an existing file.
     *
     * @method updateContents
     * @param {file} file A `file` model with `isFolder == false`.
     * @param {Object} contents A native `File` object or another appropriate
     * payload for uploading.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the updated `file` model or
     * rejects with an error message.
     */
    async updateContents(file: File, data: string, options: Options = {}): Promise<any> {
        const url = file.get('links').upload;
        const { query = {} } = options;

        await this.waterbutlerRequest('PUT', url, {
            ...options,
            data,
            query: {
                ...query,
                kind: 'file',
            },
        });

        return this.reloadModel(file);
    }

    /**
     * Check out a file, so only the current user can modify it.
     *
     * @method checkOut
     * @param {file} file `file` model with `isFolder == false`.
     * @return {Promise} Promise that resolves on success or rejects with an
     * error message.
     */
    checkOut(file: File): Promise<any> {
        return run(async () => {
            if (!this.session.data) {
                return;
            }
            const userID = this.session.data.authenticated.id;
            file.set('checkout', userID);

            try {
                return await file.save();
            } catch (e) {
                file.rollbackAttributes();
                throw e;
            }
        });
    }

    /**
     * Check in a file, so anyone with permission can modify it.
     *
     * @method checkOut
     * @param {file} file `file` model with `isFolder == false`.
     * @return {Promise} Promise that resolves on success or rejects with an
     * error message.
     */
    checkIn(file: File): Promise<any> {
        return run(async () => {
            file.set('checkout', '');

            try {
                return await file.save();
            } catch (e) {
                file.rollbackAttributes();
                throw e;
            }
        });
    }

    /**
     * Create a new folder
     *
     * @method addSubfolder
     * @param {file} folder Location of the new folder, a `file` model with
     * `isFolder == true`.
     * @param {String} name Name of the folder to create.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the new folder's model or
     * rejects with an error message.
     */
    async addSubfolder(folder: File, name: string, options: Options = {}): Promise<any> {
        let url = folder.get('links').new_folder;

        // HACK: This is the only WB link that already has a query string
        const queryStart = url.search(/\?kind=folder$/);
        if (queryStart > -1) {
            url = url.slice(0, queryStart);
        }

        const { query = {} } = options;

        await this.waterbutlerRequest('PUT', url, {
            ...options,
            query: {
                ...query,
                name,
                kind: 'folder',
            },
        });

        return this.getNewFileInfo(folder, name);
    }

    /**
     * Upload a file
     *
     * @method uploadFile
     * @param {file} folder Location of the new file, a `file` model with
     * `isFolder == true`.
     * @param {String} name Name of the new file.
     * @param {Object} data A native `File` object or another appropriate
     * payload for uploading.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the new file's model or
     * rejects with an error message.
     */
    async uploadFile(folder: File, name: string, data: string, options: Options = {}): Promise<any> {
        const url = folder.get('links').upload;
        const { query = {} } = options;

        await this.waterbutlerRequest('PUT', url, {
            ...options,
            data,
            query: {
                ...query,
                name,
                kind: 'file',
            },
        });

        return this.getNewFileInfo(folder, name);
    }

    /**
     * Rename a file or folder
     *
     * @method rename
     * @param {file} file `file` model to rename.
     * @param {String} rename New name for the file.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the updated `file` model or
     * rejects with an error message.
     */
    async rename(file: File, rename: string, options: Options = {}): Promise<any> {
        const url = file.get('links').move;

        await this.waterbutlerRequest('POST', url, {
            ...options,
            data: JSON.stringify({ action: 'rename', rename }),
        });

        return this.reloadModel(file);
    }

    /**
     * Move (or copy) a file or folder
     *
     * @method move
     * @param {file} file `file` model to move.
     * @param {file} targetFolder Where to move the file, a `file` model with
     * `isFolder == true`.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @param {String} [options.data.rename] If specified, also rename the file
     * to the given name.
     * @param {String} [options.data.resource] Optional node ID. If specified,
     * move the file to that node.
     * @param {String} [options.data.provider] Optional provider name. If
     * specified, move the file to that provider.
     * @param {String} [options.data.action='move'] Either 'move' or 'copy'.
     * @param {String} [options.data.conflict='replace'] Specifies what to do if
     * a file of the same name already exists in the target folder. If 'keep',
     * rename this file to avoid conflict. If replace, the existing file is
     * destroyed.
     * @return {Promise} Promise that resolves to the the updated (or newly
     * created) `file` model or rejects with an error message.
     */
    async move(file: File, targetFolder: File, options: Options<WaterbutlerData> = {}): Promise<File> {
        const url = file.get('links').move;
        const { data = {} } = options;
        const { action = 'move' } = data;

        const { data: { attributes: { name } } } = await this.waterbutlerRequest('POST', url, {
            ...options,
            data: JSON.stringify({
                ...data,
                action,
                path: targetFolder.get('path'),
            }),
        });

        return this.getNewFileInfo(targetFolder, name);
    }

    /**
     * Copy a file or folder.
     * Convenience method for `move` with `options.copy == true`.
     *
     * @method copy
     * @param {file} file `file` model to copy.
     * @param {file} targetFolder Where to copy the file, a `file` model with
     * `isFolder == true`.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @param {String} [options.data.rename] If specified, also rename the file
     * to the given name.
     * @param {String} [options.data.resource] Optional node ID. If specified,
     * move the file to that node.
     * @param {String} [options.data.provider] Optional provider name. If
     * specified, move the file to that provider.
     * @param {String} [options.data.conflict='replace'] Specifies what to do if
     * a file of the same name already exists in the target folder. If 'keep',
     * rename this file to avoid conflict. If replace, the existing file is
     * destroyed.
     * @return {Promise} Promise that resolves to the the new `file` model or
     * rejects with an error message.
     */
    copy(file: File, targetFolder: File, options: Options<WaterbutlerData> = {}): Promise<File> {
        const { data = {} } = options;

        return this.move(file, targetFolder, {
            ...options,
            data: {
                ...data,
                action: 'copy',
            },
        });
    }

    /**
     * Delete a file or folder
     *
     * @method deleteFile
     * @param {file} file `file` model to delete.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves on success or rejects with an
     * error message.
     */
    async deleteFile(file: File, options: Options = {}): Promise<any> {
        const url = file.get('links').delete;

        await this.waterbutlerRequest('DELETE', url, options);

        const parent = file.get('parentFolder');

        if (parent) {
            return this.reloadModel(parent.get('files'));
        }

        this.store.unloadRecord(file);

        return true;
    }

    /**
     * Check whether the given url corresponds to a model that is currently
     * reloading after a file operation.
     *
     * Used by `mixin:file-cache-bypass` to avoid a race condition where the
     * cache might return stale, inaccurate data.
     *
     * @method isReloadingUrl
     * @param {String} url
     * @return {Boolean} `true` if `url` corresponds to a pending reload on a
     * model immediately after a Waterbutler action, otherwise `false`.
     */
    isReloadingUrl(url: string): boolean {
        return this.reloadingUrls.has(url);
    }

    /**
     * Force-reload a model from the API.
     *
     * @method reloadModel
     * @private
     * @param {Object} model `file` model or a `files` relationship
     * @return {Promise} Promise that resolves to the reloaded model or
     * rejects with an error message.
     */
    private async reloadModel(model: File | any): Promise<any> {
        // If it's a file model, it has its own URL in `links.info`.
        let reloadUrl = model.get('links').info;
        if (!reloadUrl) {
            // If it's not a file model, it must be a relationship.
            // HACK: Looking at Ember's privates.
            reloadUrl = model.get('content.relationship.link');
        }
        if (reloadUrl) {
            this.reloadingUrls.add(reloadUrl);
        }

        try {
            const freshModel = await model.reload();

            if (reloadUrl) {
                this.reloadingUrls.delete(reloadUrl);
            }

            return freshModel;
        } catch (error) {
            if (reloadUrl) {
                this.reloadingUrls.delete(reloadUrl);
            }

            throw error;
        }
    }

    /**
     * Make a Waterbutler request
     *
     * @method waterbutlerRequest
     * @private
     * @param {String} method HTTP method for the request.
     * @param {String} url Waterbutler URL.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the data returned from the
     * server on success, or rejects with an error message.
     */
    private waterbutlerRequest(method: string, url: string, options: Options = {}): Promise<any> {
        const { data, query } = options;

        return authenticatedAJAX({
            url: query ? `${url}?${$.param(query)}` : url,
            method,
            data,
            processData: false,
        });
    }

    /**
     * Get the `file` model for a newly created file.
     *
     * @method getNewFileInfo
     * @private
     * @param {file} parentFolder Model for the new file's parent folder.
     * @param {String} name Name of the new file.
     * @return {Promise} Promise that resolves to the new file's model or
     * rejects with an error message.
     */
    private async getNewFileInfo(parentFolder: any, name: string): Promise<File> {
        const files: File[] = await parentFolder.queryHasMany('files', { 'filter[name]': name });
        const file = files.findBy('name', name);

        if (!file) {
            throw new Error('Cannot load metadata for uploaded file.');
        }

        return file;
    }
}

declare module '@ember/service' {
    interface Registry {
        'file-manager': FileManager;
    }
}
