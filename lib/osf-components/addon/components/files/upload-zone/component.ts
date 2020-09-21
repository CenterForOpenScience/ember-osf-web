import { A } from '@ember/array';
import MutableArray from '@ember/array/mutable';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';
import $ from 'jquery';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

import { getApiError, getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { ErrorDocument, Resource } from 'osf-api';
import { FilesManager } from 'osf-components/components/files/manager/component';
import template from './template';

interface FileResource extends Resource {
    id: string;
}

interface DropzoneFileUpload {
    status: string;
    accepted: boolean;
}

/* eslint-disable camelcase */
interface UploadResponse {
    message: string;
    message_long: string;
    data: FileResource;
}
/* eslint-enable camelcase */

@layout(template)
export default class UploadZone extends Component {
    @service toast!: Toast;
    @service analytics!: Analytics;
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
    buttonClass = '';
    existingFile?: File;

    @alias('filesManager.canEdit') canEdit!: boolean;
    @notEmpty('uploading') isUploading!: boolean;

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

    @task({ withTestWaiter: true })
    success = task(function *(this: UploadZone, _: unknown, __: unknown, file: File, response: UploadResponse) {
        this.analytics.trackFromElement(this.element, {
            name: 'Upload file',
            category: 'upload',
            action: 'link',
        });
        const fileId = response.data.id;
        yield this.filesManager.addFile(fileId.replace(/^.*\//, ''));

        this.uploading.removeObject(file);
    });

    @task({ withTestWaiter: true })
    preUpload = task(function *(this: UploadZone, _: unknown, __: unknown, file: File) {
        let existingFile = this.filesManager.displayedItems.findBy('itemName', file.name);
        if (!existingFile) {
            [existingFile] = yield this.filesManager.currentFolder.queryHasMany('files', {
                'filter[name][eq]': file.name,
            });
        }
        this.setProperties({ existingFile });
    });

    didReceiveAttrs() {
        assert('Files::UploadZone requires @filesManager!', Boolean(this.filesManager));
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
    error(_: unknown, __: unknown, file: File & DropzoneFileUpload, response: ErrorDocument & UploadResponse | string) {
        this.uploading.removeObject(file);
        let toastMessage = '';
        if (typeof response === 'string') {
            toastMessage = response;
        } else {
            const apiError = getApiError(response);
            // TODO: Double-check when [ENG-2122] is merged,
            // might need to change how we grab the api error
            if (apiError && apiError.status === '507') {
                toastMessage = getApiErrorMessage(response);
            } else {
                toastMessage = response.message_long || response.message;
            }
        }
        this.toast.error(toastMessage);
    }

    @action
    buildUrl(files: File[]) {
        const { name } = files[0];
        const { existingFile } = this;

        if (existingFile) {
            assert('preUpload and buildUrl were called with different files!', name === existingFile.name);
            return existingFile.links.upload;
        }

        return `${this.uploadUrl}?${$.param({ kind: 'file', name })}`;
    }

    @action
    setButtonClass(buttonClass: string = '') {
        this.setProperties({ buttonClass });
    }
}
