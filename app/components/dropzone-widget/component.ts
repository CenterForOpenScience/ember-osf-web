import { className } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import $ from 'jquery';
import CustomDropzone from './custom-dropzone';

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
export default class DropzoneWidget extends Component {
    @service session;

    @className
    dropzone: boolean = true;

    enable: boolean = this.enable && true;
    clickable: boolean = this.clickable && true;
    dropzoneElement: any;
    preUpload: any;
    options: any;
    buildUrl: string | ((file: any) => string);
    defaultMessage: string;

    // Used to detect when these attributes change
    attrCache = {
        enable: this.enable,
        clickable: this.clickable,
    };

    loadDropzone(this: DropzoneWidget) {
        const preUpload = this.get('preUpload');
        const dropzoneOptions = this.get('options') || {};

        // @ts-ignore Dropzone's types aren't quite right
        const drop = new CustomDropzone(`#${this.elementId}`, {
            url: file => {
                const buildUrl = this.get('buildUrl');
                return typeof buildUrl === 'function' ? buildUrl(file) : buildUrl;
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
        if (this.get('options').get('preventMultipleFiles') && this.get('clickable')) {
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
        drop.options = { ...drop.options, ...dropzoneOptions };

        // Attach dropzone event listeners: http://www.dropzonejs.com/#events
        drop.events.forEach(event => {
            if (typeof this.get(event) === 'function') {
                drop.on(event, (...args) => this.get(event)(this, drop, ...args));
            }
        });
    }

    destroyDropzone(this: DropzoneWidget) {
        if (this.get('dropzoneElement')) {
            this.get('dropzoneElement').destroy();
        }
    }

    didUpdateAttrs(this: DropzoneWidget) { // eslint-disable-line ember/no-attrs-snapshot
        this._super(...arguments);
        const { attrCache, enable, clickable } = this.getProperties('attrCache', 'enable', 'clickable');
        if (attrCache.enable !== enable) {
            if (enable) {
                this.loadDropzone();
            } else {
                this.destroyDropzone();
            }
        } else if (enable && attrCache.clickable !== clickable) {
            // Dropzone must be reloaded for clickable changes to take effect.
            this.destroyDropzone();
            this.loadDropzone();
        }
    }

    didInsertElement(this: DropzoneWidget) {
        if (this.get('enable')) {
            this.loadDropzone();
        }
    }
}
