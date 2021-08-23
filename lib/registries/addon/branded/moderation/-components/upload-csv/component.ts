import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class UploadCsvComponent extends Component {
    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: true,
        acceptDirectories: false,
    };

    @tracked dropping = false;

    @action
    buildUrl() {
        return 'http://localhost:8000/v2/providers/registrations/osf/upload_csv/aloha.csv/';
    }

    @action
    addedFile(_: unknown, __: unknown, ___: File) {
        // this.uploading.pushObject(file);
    }

    @action
    uploadProgress(_: unknown, __: unknown, _____: File, ______: number) {
        // const uploadElement = $(`#uploading-${file.size}`);
        // uploadElement.css('width', `${progress}%`);
    }

    @action
    error(_: unknown, __: unknown, ____: File & DropzoneFileUpload, _____: ErrorDocument & UploadResponse | string) {
        // this.uploading.removeObject(file);
        // let toastMessage = '';
        // let error;
        // if (typeof response === 'string') {
        //     toastMessage = response;
        //     error = new Error(response);
        // } else {
        //     error = response;
        //     if (response.code === 507) {
        //         toastMessage = this.intl.t('osf-components.files-widget.insufficient_storage_error');
        //     } else {
        //         toastMessage = response.message_long || response.message;
        //     }
        // }
        // captureException(error, { errorMessage: toastMessage });
        // this.toast.error(toastMessage);
    }

    @action
    success() {
        //
    }
}
