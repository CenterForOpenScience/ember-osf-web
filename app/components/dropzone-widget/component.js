import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import diffAttrs from 'ember-diff-attrs';
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
export default Component.extend({
    session: service(),
    i18n: service(),

    classNameBindings: ['dropzone'],
    dropzone: true,
    enable: true,
    clickable: true,
    dropzoneElement: null,

    didReceiveAttrs: diffAttrs('enable', 'clickable', function(changedAttrs, ...args) {
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

    didInsertElement() {
        if (this.get('enable')) {
            this.loadDropzone();
        }
    },

    loadDropzone() {
        const preUpload = this.get('preUpload');
        const dropzoneOptions = this.get('options') || {};
        const i18n = this.get('i18n');

        function CustomDropzone() {
            Dropzone.call(this, ...arguments);
        }
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
            return Dropzone.prototype.drop.call(this, e);
        };
        CustomDropzone.prototype._addFilesFromDirectory = function(directory_, path) {
            const directory = directory_;
            if (!this.options.acceptDirectories) {
                directory.status = Dropzone.ERROR;
                this.emit('error', directory, i18n.t('dropzone_widget.error_directories'));
                return;
            }
            return Dropzone.prototype._addFilesFromDirectory.call(directory, path);
        };

        const drop = new CustomDropzone(`#${this.elementId}`, {
            url: file => (typeof this.get('buildUrl') === 'function' ?
                this.get('buildUrl')(file) :
                this.get('buildUrl')),
            autoProcessQueue: false,
            autoQueue: false,
            clickable: this.get('clickable'),
            dictDefaultMessage: this.get('defaultMessage') || i18n.t('dropzone_widget.drop_files'),
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

        const authType = config['ember-simple-auth'].authorizer;
        this.get('session').authorize(authType, (headerName, content) => {
            headers[headerName] = content;
        });
        dropzoneOptions.headers = headers;
        dropzoneOptions.withCredentials = (config.authorizationType === 'cookie');

        // Attach preUpload to addedfile event
        drop.on('addedfile', file => {
            if (preUpload) {
                preUpload(this, drop, file).then(() => drop.processFile(file));
            } else {
                drop.processFile(file);
            }
        });

        // Set dropzone options
        Object.assign(drop.options, dropzoneOptions);

        // Attach dropzone event listeners: http://www.dropzonejs.com/#events
        drop.events.forEach(event => {
            if (typeof this.get(event) === 'function') {
                drop.on(event, (...args) => this.get(event)(this, drop, ...args));
            }
        });
    },

    destroyDropzone() {
        if (this.get('dropzoneElement')) {
            this.get('dropzoneElement').destroy();
        }
    },
});
