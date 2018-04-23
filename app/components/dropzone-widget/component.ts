import { className } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import diffAttrs from 'ember-diff-attrs';
import config from 'ember-get-config';
import File from 'ember-osf-web/models/file';
import defaultTo from 'ember-osf-web/utils/default-to';
import eatArgs from 'ember-osf-web/utils/eat-args';
import $ from 'jquery';

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
export default class DropzoneWidget extends Component.extend({
    didReceiveAttrs: diffAttrs('enable', 'clickable', function(this: DropzoneWidget, changedAttrs, ...args) {
        this._super(...args);
        if (changedAttrs) {
            if (changedAttrs.enable) {
                if (this.enable) {
                    this.loadDropzone();
                } else {
                    this.destroyDropzone();
                }
            } else if (changedAttrs.clickable && this.enable) {
                // Dropzone must be reloaded for clickable changes to take effect.
                const [before, after] = changedAttrs.clickable;
                const beforeSet = new Set(before);
                const afterSet = new Set(after);

                const reRender = beforeSet.size !== afterSet.size
                    || (new Set([...beforeSet].filter(item => !afterSet.has(item)))).size;

                if (reRender) {
                    this.destroyDropzone();
                    this.loadDropzone();
                }
            }
        }
    }),
}) {
    @service session;
    @service i18n;

    @className('dropzone')

    dropzone = defaultTo(this.dropzone, true);
    enable = defaultTo(this.enable, true);
    clickable = defaultTo(this.clickable, true);
    dropzoneElement = defaultTo(this.dropzoneElement, null);
    options: Dropzone.DropzoneOptions = defaultTo(this.options, {});
    defaultMessage: string = defaultTo(this.defaultMessage, this.i18n.t('dropzone_widget.drop_files'));

    preUpload: (context, drop, file) => Promise<any> = defaultTo(this.preUpload, undefined);

    /**
     * Placeholder for closure action: buildUrl
     */
    buildUrl(files: File[]): void {
        eatArgs(files);
        assert('You should pass in a closure action: buildUrl');
    }

    didInsertElement() {
        if (this.enable) {
            this.loadDropzone();
        }
    }

    loadDropzone(this: DropzoneWidget) {
        function CustomDropzone(this: DropzoneWidget, ...args) {
            // @ts-ignore - Dropzone is a global
            Dropzone.call(this, ...args);
        }
        const { i18n } = this;
        // @ts-ignore - Dropzone is a global
        CustomDropzone.prototype = Object.create(Dropzone.prototype);
        CustomDropzone.prototype.drop = function(e) {
            if (this.options.preventMultipleFiles && e.dataTransfer) {
                if ((e.dataTransfer.items && e.dataTransfer.items.length > 1) || e.dataTransfer.files.length > 1) {
                    this.emit('drop', e);
                    this.emit('error', 'None', i18n.t('dropzone_widget.error_multiple_files'));
                    return;
                }
                if (e.dataTransfer.files.length === 0) {
                    this.emit('drop', e);
                    this.emit('error', 'None', i18n.t('dropzone_widget.error_directories'));
                    return;
                }
            }
            // @ts-ignore - Dropzone is a global
            return Dropzone.prototype.drop.call(this, e);
        };
        CustomDropzone.prototype._addFilesFromDirectory = function(dir, path) {
            const directory = dir;
            if (!this.options.acceptDirectories) {
                // @ts-ignore - Dropzone is a global
                directory.status = Dropzone.ERROR;
                this.emit('error', directory, i18n.t('dropzone_widget.error_directories'));
                return;
            }
            // @ts-ignore - Dropzone is a global
            return Dropzone.prototype._addFilesFromDirectory.call(directory, path);
        };

        const drop = new CustomDropzone(`#${this.elementId}`, {
            url: file => (typeof this.buildUrl === 'function' ?
                this.buildUrl(file) :
                this.buildUrl),
            autoProcessQueue: false,
            autoQueue: false,
            clickable: this.clickable,
            dictDefaultMessage: this.defaultMessage,
            sending(file, xhr) {
                // Monkey patch to send the raw file instead of formData
                xhr.send = xhr.send.bind(xhr, file); // eslint-disable-line no-param-reassign
            },
        });

        // Dropzone.js does not have an option for disabling selecting multiple files when clicking the "upload" button.
        // Therefore, we remove the "multiple" attribute for the hidden file input element, so that users cannot select
        // multiple files for upload in the first place.
        // @ts-ignore - Custom dropzone
        if (this.options.preventMultipleFiles && this.clickable) {
            $('.dz-hidden-input').removeAttr('multiple');
        }

        this.set('dropzoneElement', drop);

        // Set osf session header
        const headers = {};

        const authType = config['ember-simple-auth'].authorizer;
        this.session.authorize(authType, (headerName, content) => {
            headers[headerName] = content;
        });
        this.options.headers = headers;
        this.options.withCredentials = (config.authorizationType === 'cookie');

        // Attach preUpload to addedfile event
        drop.on('addedfile', file => {
            if (this.preUpload) {
                this.preUpload(this, drop, file).then(() => drop.processFile(file));
            } else {
                drop.processFile(file);
            }
        });

        // Set dropzone options
        Object.assign(drop.options, this.options);

        // Attach dropzone event listeners: http://www.dropzonejs.com/#events
        drop.events.forEach(event => {
            if (typeof this.get(event) === 'function') {
                drop.on(event, (...args) => this.get(event)(this, drop, ...args));
            }
        });
    }

    destroyDropzone() {
        if (this.dropzoneElement) {
            this.dropzoneElement.destroy();
        }
    }
}
