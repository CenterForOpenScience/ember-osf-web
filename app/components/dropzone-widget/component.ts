import { classNames } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import diffAttrs from 'ember-diff-attrs';
import config from 'ember-get-config';
import $ from 'jquery';

import defaultTo from 'ember-osf-web/utils/default-to';

const authType = config['ember-simple-auth'].authorizer;

function CustomDropzone(...args) {
    Dropzone.call(this, ...args);
}
CustomDropzone.prototype = Object.create(Dropzone.prototype);
CustomDropzone.prototype.drop = function (e) {
    if (this.options.preventMultipleFiles && e.dataTransfer) {
        if ((e.dataTransfer.items && e.dataTransfer.items.length > 1) || e.dataTransfer.files.length > 1) {
            this.emit('drop', e);
            this.emit('error', 'None', 'Cannot upload multiple files');
            return;
        }
        if (e.dataTransfer.files.length === 0) {
            this.emit('drop', e);
            this.emit('error', 'None', 'Cannot upload directories, applications, or packages');
            return;
        }
    }
    return Dropzone.prototype.drop.call(this, e);
};
CustomDropzone.prototype._addFilesFromDirectory = function (dir, path) {
    const directory = { ...dir };

    if (!this.options.acceptDirectories) {
        directory.status = Dropzone.ERROR;
        this.emit('error', directory, 'Cannot upload directories, applications, or packages');
        return;
    }

    return Dropzone.prototype._addFilesFromDirectory.call(directory, path);
};

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * Support file uploads via dropzone.
 * Accepts dropzone event listeners as parameters (e.g. success, error, addedfile)
 *
 * Sample usage:
 * ```handlebars
 * {{dropzone-widget
 *   preUpload=attrs.preUpload
 *   buildUrl=buildUrl
 *   success=attrs.success
 *   defaultMessage=defaultMessage
 *   options=dropzoneOptions
 *   clickable=clickable}}
 * ```
 *
 * @class dropzone-widget
 */
@classNames('dropzone')
export default class DropzoneWidget extends Component.extend({
    didReceiveAttrs: diffAttrs('enable', 'clickable', function (this: DropzoneWidget, changedAttrs, ...args) {
        this._super(...args);

        if (changedAttrs) {
            if (changedAttrs.enable) {
                if (this.get('enable')) {
                    this.loadDropzone();
                } else {
                    this.destroyDropzone();
                }
            } else if (changedAttrs.clickable && this.get('enable')) {
                // Dropzone must be reloaded for clickable changes to take effect.
                this.destroyDropzone();
                this.loadDropzone();
            }
        }
    }),
}) {
    @service session;

    enable: boolean = defaultTo(this.enable, true);
    clickable: boolean = defaultTo(this.clickable, true);
    dropzoneElement: Dropzone | null = defaultTo(this.dropzoneElement, null);

    didInsertElement(this: DropzoneWidget) {
        if (this.get('enable')) {
            this.loadDropzone();
        }
    }

    loadDropzone(this: DropzoneWidget) {
        const preUpload = this.get('preUpload');
        const dropzoneOptions = this.get('options') || {};
        const buildUrl = this.get('buildUrl');

        const drop = new CustomDropzone(`#${this.elementId}`, {
            url(...args) {
                return typeof buildUrl === 'function' ? buildUrl(...args) : buildUrl;
            },
            autoProcessQueue: false,
            autoQueue: false,
            clickable: this.get('clickable'),
            dictDefaultMessage: this.get('defaultMessage') || 'Drop files here to upload',
            sending(file, xhr) {
                // Monkey patch to send the raw file instead of formData
                xhr.send = xhr.send.bind(xhr, file); // eslint-disable-line no-param-reassign
            },
        });

        // Dropzone.js does not have an option for disabling selecting multiple files when clicking the "upload" button.
        // Therefore, we remove the "multiple" attribute for the hidden file input element, so that users cannot select
        // multiple files for upload in the first place.
        if (this.get('options.preventMultipleFiles') && this.get('clickable')) {
            $('.dz-hidden-input').removeAttr('multiple');
        }

        this.set('dropzoneElement', drop);

        // Set osf session header
        const headers = {};

        this.get('session')
            .authorize(authType, (headerName, content) => Object.assign(headers, { [headerName]: content }));

        Object.assign(dropzoneOptions, {
            headers,
            withCredentials: config.authorizationType === 'cookie',
        });

        // Attach preUpload to addedfile event
        drop.on('addedfile', async file => {
            if (preUpload) {
                await preUpload(this, drop, file);
            }

            drop.processFile(file);
        });

        // Set dropzone options
        Object.assign(drop.options, dropzoneOptions);

        // Attach dropzone event listeners: http://www.dropzonejs.com/#events
        drop.events.forEach(event => {
            if (typeof this.get(event) === 'function') {
                drop.on(event, (...args) => this.get(event)(this, drop, ...args));
            }
        });
    }

    destroyDropzone(this: DropzoneWidget) {
        const dropzoneElement = this.get('dropzoneElement');

        if (dropzoneElement) {
            dropzoneElement.destroy();
        }
    }
}
