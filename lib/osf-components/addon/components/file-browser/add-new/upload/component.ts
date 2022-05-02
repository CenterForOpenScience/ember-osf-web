import { action, notifyPropertyChange } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';
import { taskFor } from 'ember-concurrency-ts';

interface Args {
    manager: OsfStorageManager;
    isOpen: boolean;
}

export default class Upload extends Component<Args> {
    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: false,
        acceptDirectories: false,
        autoProcessQueue: true,
    };

    @service intl!: Intl;
    @service toast!: Toast;
    @tracked uploading: any[] = [];
    @tracked uploadCompleted: any[] = [];
    @tracked uploadErrored: any[] = [];
    // @tracked shouldShowResultsModal = false;
    // @tracked shouldShowUploadingModal = false;
    @tracked clickableElementId = '';

    get clickableElementSelectors() {
        if (this.clickableElementId) {
            return [`#${this.clickableElementId}`];
        }
        return [];
    }

    get shouldShowUploadingModal() {
        return this.uploading.length !== 0;
    }

    get shouldShowFailureModal() {
        return this.uploadErrored.length !== 0 &&
            this.uploading.length === 0;
    }

    get shouldShowSuccessModal() {
        return this.uploadCompleted.length !== 0 &&
            this.uploadErrored.length === 0 &&
            this.uploading.length === 0;
    }

    get shouldShowModal() {
        return this.shouldShowFailureModal ||
            this.shouldShowUploadingModal ||
            this.shouldShowSuccessModal;
    }

    @action
    buildUrl(files: any[]) {
        const { name } = files[0];
        return `${this.args.manager.currentFolder.links.upload}?${$.param({ kind: 'file', name })}`;
    }

    @action
    addedFile(_: any, __: any, file: any) {
        this.uploading.pushObject(file);
        notifyPropertyChange(this, 'uploading');
    }

    @action
    error(_: any, __: any, file: any) {
        this.uploading.removeObject(file);
        if (!this.uploadErrored.includes(file)) {
            this.uploadErrored.pushObject(file);
        }
        notifyPropertyChange(this, 'uploading');
        notifyPropertyChange(this, 'uploadErrored');
    }

    @action
    success(_: any, __: any, file: any, ___: any) {
        this.uploading.removeObject(file);
        if (this.uploadErrored.includes(file)) {
            this.uploadErrored.removeObject(file);
        }
        this.uploadCompleted.pushObject(file);
        notifyPropertyChange(this, 'uploading');
        notifyPropertyChange(this, 'uploadCompleted');
    }

    retryUpload(dropzoneInstance: any, file: any) {
        dropzoneInstance.processFile(file);
    }

    @action
    setClickableElementId(id: string) {
        this.clickableElementId = id;
    }

    @action
    closeModal() {
        this.uploadCompleted = [];
        this.uploadErrored = [];
        notifyPropertyChange(this, 'uploadCompleted');
        notifyPropertyChange(this, 'uploadErrored');
        taskFor(this.args.manager.reload).perform();
    }
}
