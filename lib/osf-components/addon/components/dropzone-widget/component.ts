import { className } from '@ember-decorators/component';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import diffAttrs from 'ember-diff-attrs';
import Intl from 'ember-intl/services/intl';
import Session from 'ember-simple-auth/services/session';
import $ from 'jquery';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import CurrentUser from 'ember-osf-web/services/current-user';

import template from './template';

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
@layout(template)
export default class DropzoneWidget extends Component.extend({
    didReceiveAttrs: diffAttrs(
        'enable',
        'clickable',
        function(this: DropzoneWidget, changedAttrs: any, ...args: any[]) {
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
        },
    ),
}) {
    @service session!: Session;
    @service intl!: Intl;
    @service currentUser!: CurrentUser;

    @className
    dropzone = true;
    enable = true;
    clickable: string[] = [];
    dropzoneElement: any | null = null;
    options: Dropzone.DropzoneOptions & { preventMultipleFiles?: boolean } = {};
    defaultMessage = this.intl.t('dropzone_widget.drop_files');

    @requiredAction buildUrl!: (files: File[]) => void;
    success?: (context: any, drop: any, file: any) => Promise<any>;
    preUpload?: (context: any, drop: any, file: any) => Promise<any>;

    didInsertElement() {
        if (this.enable) {
            this.loadDropzone();
        }
    }

    preventMultiple() {
        // Dropzone.js does not have an option for disabling selecting multiple files when clicking the "upload" button.
        // Therefore, we remove the "multiple" attribute for the hidden file input element, so that users cannot select
        // multiple files for upload in the first place.
        if (this.options.preventMultipleFiles && this.clickable) {
            $('.dz-hidden-input').removeAttr('multiple');
        }
    }

    loadDropzone() {
        function CustomDropzone(...args: any[]) {
            // @ts-ignore - Dropzone is a global
            Dropzone.call(this, ...args);
        }
        const { intl } = this;
        // @ts-ignore - Dropzone is a global
        CustomDropzone.prototype = Object.create(Dropzone.prototype);
        CustomDropzone.prototype.drop = function(e: any) {
            if (this.options.preventMultipleFiles && e.dataTransfer) {
                if ((e.dataTransfer.items && e.dataTransfer.items.length > 1) || e.dataTransfer.files.length > 1) {
                    this.emit('drop', e);
                    this.emit('error', 'None', intl.t('dropzone_widget.error_multiple_files'));
                    return undefined;
                }
                if (e.dataTransfer.files.length === 0) {
                    this.emit('drop', e);
                    this.emit('error', 'None', intl.t('dropzone_widget.error_directories'));
                    return undefined;
                }
            }
            // @ts-ignore - Dropzone is a global
            return Dropzone.prototype.drop.call(this, e);
        };
        CustomDropzone.prototype._addFilesFromDirectory = function(dir: any, path: any) {
            const directory = dir;
            if (!this.options.acceptDirectories) {
                // @ts-ignore - Dropzone is a global
                directory.status = Dropzone.ERROR;
                this.emit('error', directory, intl.t('dropzone_widget.error_directories'));
                return undefined;
            }
            // @ts-ignore - Dropzone is a global
            return Dropzone.prototype._addFilesFromDirectory.call(directory, path);
        };

        const authorizeXHR = this.currentUser.authorizeXHR.bind(this.currentUser);

        // @ts-ignore: TODO: fix types
        const drop = new CustomDropzone(`#${this.elementId}`, {
            url: (file: any) => (typeof this.buildUrl === 'function'
                ? this.buildUrl(file)
                : this.buildUrl),
            autoProcessQueue: false,
            autoQueue: false,
            clickable: this.clickable.length ? this.clickable : '',
            dictDefaultMessage: this.defaultMessage,
            previewsContainer: false,
            sending(file: any, xhr: XMLHttpRequest) {
                authorizeXHR(xhr);

                // Monkey patch to send the raw file instead of formData
                xhr.send = xhr.send.bind(xhr, file); // eslint-disable-line no-param-reassign
            },
        });

        this.preventMultiple();

        this.set('dropzoneElement', drop);

        // Attach preUpload to addedfile event
        drop.on('addedfile', (file: any) => {
            if (this.preUpload) {
                this.preUpload(this, drop, file).then(() => drop.processFile(file));
            } else if (!this.options.autoQueue) {
                drop.processFile(file);
            }
        });

        // Remove the multiple tag when complete event fires after file upload
        drop.on('complete', () => {
            this.preventMultiple();
        });

        // Set dropzone options
        Object.assign(drop.options, this.options);

        // Attach dropzone event listeners: http://www.dropzonejs.com/#events
        drop.events.forEach((event: any) => {
            if (typeof this.get(event) === 'function') {
                drop.on(event, (...args: any[]) => this.get(event)(this, drop, ...args));
            }
        });
    }

    destroyDropzone() {
        if (this.dropzoneElement) {
            this.dropzoneElement.destroy();
        }
    }
}
