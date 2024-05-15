import { action, notifyPropertyChange } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import { TrackedWeakMap } from 'tracked-built-ins';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

interface PreprintUploadArgs {
    manager: PreprintStateMachine;
    preprint: PreprintModel;
    allowVersioning: boolean;
    clickableElementId: string;
    dragEnter: () => {};
    dragLeave: () => {};
    dragOver: () => {};
}


export default class PreprintUpload extends Component<PreprintUploadArgs> {
    @service intl!: Intl;
    @service toast!: Toast;
    @tracked uploading: any[] = [];
    @tracked uploadCompleted: any[] = [];
    @tracked uploadErrored: any[] = [];
    @tracked uploadConflicted: any[] = [];

    uploadProgress = new TrackedWeakMap();

    get clickableElementSelectors() {
        if (this.args.clickableElementId) {
            return [`#${this.args.clickableElementId}`];
        }
        return [];
    }

    get dropzoneOptions() {
        const uploadLimit = 1;
        return {
            createImageThumbnails: false,
            method: 'PUT',
            withCredentials: true,
            preventMultipleFiles: false,
            acceptDirectories: false,
            autoProcessQueue: true,
            autoQueue: true,
            parallelUploads: uploadLimit,
            maxFilesize: 10000000,
            timeout: null,
        };
    }


    @action
    updateUploadProgress(_: any, __: any, file: any, progress: any) {
        this.uploadProgress.set(file, progress);
    }

    @action
    buildUrl(files: any[]) {
        const { name, newUploadLink } = files[0];
        if (newUploadLink) {
            return newUploadLink;
        }

        const url = new URL(this.args.manager.preprint.files[0].upload as string);

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
        this.uploadProgress.set(file, 0);
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
        this.uploadProgress.set(file, 0);
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


    @action
    setClickableElementId(id: string) {
        this.args.clickableElementId = id;
    }
}
