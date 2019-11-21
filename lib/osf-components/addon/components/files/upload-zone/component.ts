import { action, computed } from '@ember-decorators/object';
import { alias, notEmpty } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import MutableArray from '@ember/array/mutable';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';
import $ from 'jquery';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import uniqueId from 'ember-osf-web/utils/unique-id';

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
        yield this.filesManager.addFile(fileId.replace(/^.*\//, ''));

        this.uploading.removeObject(file);
    }),
}) {
    @service toast!: Toast;
    @service analytics!: Analytics;
    @service i18n!: I18N;
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;

    filesManager!: FilesManager;
    uploading: MutableArray<File> = A([]);
    dropping: boolean = false;
    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: true,
        acceptDirectories: false,
    };
    uploadButtonClass = uniqueId(['dz-upload-button']);
    buttonClass = '';

    @alias('filesManager.canEdit') canEdit!: boolean;
    @notEmpty('uploading') isUploading!: boolean;

    didReceiveAttrs() {
        assert('Files::UploadZone requires @filesManager!', Boolean(this.filesManager));
    }

    @computed('canEdit', 'buttonClass')
    get clickable() {
        if (!this.buttonClass) {
            return [];
        }
        return this.canEdit ? [`.${this.buttonClass}`] : [];
    }

    @computed('filesManager.{currentFolder,fileProvider,inRootFolder}')
    get uploadUrl() {
        // Waterbutler does not allow uploading to fileProvider.rootFolder
        const { inRootFolder, currentFolder, fileProvider } = this.filesManager;
        const folder = inRootFolder ? fileProvider : currentFolder;
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
        const existingFile = this.filesManager.displayedItems.findBy('itemName', name);

        return existingFile ? existingFile.links.upload : `${this.uploadUrl}?${$.param({ kind: 'file', name })}`;
    }

    @action
    updateClickable() {
        const { uploadButtonClass: buttonClass } = this;

        if (this.buttonClass) {
            this.setProperties({ buttonClass: '' });
        } else {
            this.setProperties({ buttonClass });
        }
    }
}
