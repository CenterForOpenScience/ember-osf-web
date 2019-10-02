import { action, computed } from '@ember-decorators/object';
import { alias, notEmpty } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import MutableArray from '@ember/array/mutable';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';
import $ from 'jquery';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import Analytics from 'ember-osf-web/services/analytics';
import { Resource } from 'osf-api';
import { FilesManager } from 'osf-components/components/files/manager/component';
import template from './template';

interface FileResource extends Resource {
    id: string;
}

/* eslint-disable camelcase */
interface UploadResponse {
    message: string;
    message_long: string;
    data: FileResource;
}
/* eslint-enable camelcase */

@layout(template)
export default class UploadZone extends Component.extend({
    success: task(function *(this: UploadZone, _: unknown, __: unknown, file: File, response: UploadResponse) {
        this.analytics.trackFromElement(this.element, {
            name: 'Upload file',
            category: 'upload',
            action: 'link',
        });
        const fileId = response.data.id;
        yield this.manager.addFile(fileId.replace(/^.*\//, ''));

        this.uploading.removeObject(file);
    }),
}) {
    @service toast!: Toast;
    @service analytics!: Analytics;
    @service i18n!: I18N;

    manager!: FilesManager;
    uploading: MutableArray<File> = A([]);
    dropzoneId = 'files-widget-dropzone';
    dropping: boolean = false;
    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: true,
        acceptDirectories: false,
    };

    @alias('manager.canEdit') enable!: boolean;
    @notEmpty('uploading') isUploading!: boolean;

    @computed('manager.{currentFolder,fileProvider}')
    get uploadUrl() {
        const folder = this.manager.currentFolder || this.manager.fileProvider;
        return folder ? folder.links.upload : undefined;
    }

    @action
    addedFile(_: unknown, __: unknown, file: File) {
        this.uploading.pushObject(file);
    }

    @action
    uploadProgress(_: unknown, __: unknown, file: File, progress: number) {
        const uploadElement = $(`#uploading-${file.size}`);
        uploadElement.css('width', `${progress}%`);
    }

    @action
    error(_: unknown, __: unknown, file: File, response: UploadResponse) {
        this.uploading.removeObject(file);
        this.toast.error(response.message_long || response.message);
    }

    @action
    buildUrl(files: File[]) {
        const { name } = files[0];
        return this.uploadUrl ? `${this.uploadUrl}?${$.param({ name })}` : undefined;
    }
}
