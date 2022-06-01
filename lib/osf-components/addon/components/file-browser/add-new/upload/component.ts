import { action, notifyPropertyChange } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';
import { TrackedWeakMap } from 'tracked-built-ins';
// import Dropzone from 'dropzone';

interface Args {
    manager: StorageManager;
    isOpen: boolean;
    allowVersioning: boolean;
    dragEnter: () => {};
    dragLeave: () => {};
    dragOver: () => {};
}


export default class Upload extends Component<Args> {
    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: false,
        acceptDirectories: false,
        autoProcessQueue: true,
        autoQueue:true,
    };

    @service intl!: Intl;
    @service toast!: Toast;
    @tracked uploading: any[] = [];
    @tracked uploadCompleted: any[] = [];
    @tracked uploadErrored: any[] = [];
    @tracked uploadConflicted: any[] = [];
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
        return this.failedFilesNumber > 0 &&
            this.uploading.length === 0;
    }

    get shouldShowSuccessModal() {
        return this.uploadCompleted.length !== 0 &&
            this.uploadConflicted.length === 0 &&
            this.uploadErrored.length === 0 &&
            this.uploading.length === 0;
    }

    get shouldShowModal() {
        return this.shouldShowFailureModal ||
            this.shouldShowUploadingModal ||
            this.shouldShowSuccessModal;
    }

    get failedFilesNumber() {
        return this.uploadErrored.length + this.uploadConflicted.length;
    }
    @action
    buildUrl(files: any[]) {
        const { name, newUploadLink } = files[0];
        if (newUploadLink) {
            return newUploadLink;
        }
        const url = new URL(this.args.manager.currentFolder.links.upload as string);
        url.searchParams.append('kind', 'file');
        url.searchParams.append('name', name);
        return url.toString();
    }

    @action
    addedFile(_: any, __: any, file: any) {
        const cache = new TrackedWeakMap();
        const initialValue = file.status;
        Object.defineProperty(file, 'status', {
            get() {
                let existingValue = cache.get(file);
                if (!existingValue) {
                    existingValue = initialValue;
                    cache.set(file, existingValue);
                }
                return existingValue;
            },
            set(value) {
                cache.set(file, value);
            },
        });
        if (!this.uploadErrored.includes(file)
            && !this.uploading.includes(file)
            && !this.uploadConflicted.includes(file)
        ) {
            this.uploading.pushObject(file);
        }
        notifyPropertyChange(this, 'uploading');
    }

    @action
    error(_: any, dropzoneInstance: any, file: any) {
        const { xhr: { status, responseText } } = file;
        if (status === 409) {
            const { data: { links: { upload } } } = JSON.parse(responseText);
            file.newUploadLink = upload;
            if (this.args.allowVersioning) {
                dropzoneInstance.processFile(file);
                return;
            }
            this.uploading.removeObject(file);
            this.uploadConflicted.pushObject(file);
        } else {
            this.uploading.removeObject(file);
            if (!this.uploadErrored.includes(file)) {
                this.uploadErrored.pushObject(file);
            }
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
        if (this.uploadConflicted.includes(file)) {
            this.uploadConflicted.removeObject(file);
        }
        this.uploadCompleted.pushObject(file);
        notifyPropertyChange(this, 'uploading');
        notifyPropertyChange(this, 'uploadCompleted');
        notifyPropertyChange(this, 'uploadConflicted');
    }

    retryUpload(dropzoneInstance: any, file: any) {
        dropzoneInstance.addFile(file);
    }

    skip(file: any) {
        this.uploadErrored.removeObject(file);
        this.uploadConflicted.removeObject(file);
    }

    @action
    setClickableElementId(id: string) {
        this.clickableElementId = id;
    }

    @action
    closeModal() {
        this.uploadCompleted = [];
        this.uploadErrored = [];
        this.args.manager.reload();
    }
}
