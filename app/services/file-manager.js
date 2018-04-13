import Service, { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import config from 'ember-get-config';

import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';

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
export default Service.extend({
    session: service(),
    store: service(),

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
    getDownloadUrl(file, options_ = {}) {
        const options = options_;
        const url = file.get('links.download');

        if (!options.query) {
            options.query = {};
        }
        if (file.get('isFolder')) {
            options.query.zip = '';
        }
        const queryString = Ember.$.param(options.query);
        if (queryString.length) {
            return `${url}?${queryString}`;
        } else {
            return url;
        }
    },

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
    getContents(file, options_ = {}) {
        const options = options_;
        const url = file.get('links.download');
        return this._waterbutlerRequest('GET', url, options);
    },

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
    updateContents(file, contents, options_ = {}) {
        const options = options_;
        const url = file.get('links').upload;
        if (!options.query) {
            options.query = {};
        }
        options.query.kind = 'file';
        options.data = contents;

        const p = this._waterbutlerRequest('PUT', url, options);
        return p.then(() => this._reloadModel(file));
    },

    /**
     * Check out a file, so only the current user can modify it.
     *
     * @method checkOut
     * @param {file} file `file` model with `isFolder == false`.
     * @return {Promise} Promise that resolves on success or rejects with an
     * error message.
     */
    checkOut(file) {
        return run(() => {
            const userID = this.get('session.data.authenticated.id');
            file.set('checkout', userID);
            return file.save().catch(error => {
                file.rollbackAttributes();
                throw error;
            });
        });
    },

    /**
     * Check in a file, so anyone with permission can modify it.
     *
     * @method checkOut
     * @param {file} file `file` model with `isFolder == false`.
     * @return {Promise} Promise that resolves on success or rejects with an
     * error message.
     */
    checkIn(file) {
        return run(() => {
            file.set('checkout', null);
            return file.save().catch(error => {
                file.rollbackAttributes();
                throw error;
            });
        });
    },

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
    addSubfolder(folder, name, options_ = {}) {
        const options = options_;
        let url = folder.get('links').new_folder;
        if (!options.query) {
            options.query = {};
        }
        options.query.name = name;
        options.query.kind = 'folder';

        // HACK: This is the only WB link that already has a query string
        const queryStart = url.search(/\?kind=folder$/);
        if (queryStart > -1) {
            url = url.slice(0, queryStart);
        }
        const p = this._waterbutlerRequest('PUT', url, options);
        return p.then(() => this._getNewFileInfo(folder, name));
    },

    /**
     * Upload a file
     *
     * @method uploadFile
     * @param {file} folder Location of the new file, a `file` model with
     * `isFolder == true`.
     * @param {String} name Name of the new file.
     * @param {Object} contents A native `File` object or another appropriate
     * payload for uploading.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the new file's model or
     * rejects with an error message.
     */
    uploadFile(folder, name, contents, options_ = {}) {
        const options = options_;
        const url = folder.get('links').upload;
        options.data = contents;
        if (!options.query) {
            options.query = {};
        }
        options.query.name = name;
        options.query.kind = 'file';

        const p = this._waterbutlerRequest('PUT', url, options);
        return p.then(() => this._getNewFileInfo(folder, name));
    },

    /**
     * Rename a file or folder
     *
     * @method rename
     * @param {file} file `file` model to rename.
     * @param {String} newName New name for the file.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the updated `file` model or
     * rejects with an error message.
     */
    rename(file, newName, options_ = {}) {
        const options = options_;
        const url = file.get('links').move;
        options.data = JSON.stringify({ action: 'rename', rename: newName });

        const p = this._waterbutlerRequest('POST', url, options);
        return p.then(() => this._reloadModel(file));
    },

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
    move(file, targetFolder, options_ = {}) {
        const options = options_;
        const url = file.get('links').move;
        const defaultData = {
            action: 'move',
            path: targetFolder.get('path'),
        };
        Ember.$.extend(defaultData, options.data);
        options.data = JSON.stringify(defaultData);

        const p = this._waterbutlerRequest('POST', url, options);
        return p.then(wbResponse => {
            const { name } = wbResponse.data.attributes;
            return this._getNewFileInfo(targetFolder, name);
        });
    },

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
    copy(file, targetFolder, options_ = {}) {
        const options = options_;
        if (!options.data) {
            options.data = {};
        }
        options.data.action = 'copy';
        return this.move(file, targetFolder, options);
    },

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
    deleteFile(file, options_ = {}) {
        const options = options_;
        const url = file.get('links').delete;
        const p = this._waterbutlerRequest('DELETE', url, options);
        return p.then(() => file.get('parentFolder').then(parent => {
            if (parent) {
                return this._reloadModel(parent.get('files'));
            } else {
                this.get('store').unloadRecord(file);
                return true;
            }
        }));
    },

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
    isReloadingUrl(url) {
        return !!this._reloadingUrls[url];
    },

    /**
     * Hash set of URLs for `model.reload()` calls that are still pending.
     *
     * @property _reloadingUrls
     * @private
     */
    _reloadingUrls: {},

    /**
     * Force-reload a model from the API.
     *
     * @method _reloadModel
     * @private
     * @param {Object} model `file` model or a `files` relationship
     * @return {Promise} Promise that resolves to the reloaded model or
     * rejects with an error message.
     */
    _reloadModel(model) {
        // If it's a file model, it has its own URL in `links.info`.
        let reloadUrl = model.get('links.info');
        if (!reloadUrl) {
            // If it's not a file model, it must be a relationship.
            // HACK: Looking at Ember's privates.
            reloadUrl = model.get('content.relationship.link');
        }
        if (reloadUrl) {
            this._reloadingUrls[reloadUrl] = true;
        }

        return model.reload().then(freshModel => {
            if (reloadUrl) {
                delete this._reloadingUrls[reloadUrl];
            }
            return freshModel;
        }).catch(error => {
            if (reloadUrl) {
                delete this._reloadingUrls[reloadUrl];
            }
            throw error;
        });
    },

    /**
     * Make a Waterbutler request
     *
     * @method _waterbutlerRequest
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
    _waterbutlerRequest(method, url_, options_ = {}) {
        let url = url_;
        const options = options_;
        if (options.query) {
            const queryString = Ember.$.param(options.query);
            url = `${url}?${queryString}`;
        }

        const headers = {};
        const authType = config['ember-simple-auth'].authorizer;
        this.get('session').authorize(authType, (headerName, content) => {
            headers[headerName] = content;
        });

        return new Ember.RSVP.Promise((resolve, reject) => {
            const p = authenticatedAJAX({
                url,
                method,
                headers,
                data: options.data,
                processData: false,
            });
            p.done(data => resolve(data));
            p.fail((_, __, error) => reject(error));
        });
    },

    /**
     * Get the `file` model for a newly created file.
     *
     * @method _getNewFileInfo
     * @private
     * @param {file} parentFolder Model for the new file's parent folder.
     * @param {String} name Name of the new file.
     * @return {Promise} Promise that resolves to the new file's model or
     * rejects with an error message.
     */
    _getNewFileInfo(parentFolder, name) {
        const p = parentFolder.queryHasMany('files', {
            'filter[name]': name,
        });
        return p.then(files => {
            const file = files.findBy('name', name);
            if (!file) {
                throw 'Cannot load metadata for uploaded file.'; // eslint-disable-line no-throw-literal
            }
            return file;
        });
    },
});
