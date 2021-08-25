import config from 'ember-get-config';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

const { OSF: { apiUrl } } = config;

interface Args {
    providerId: string;
}
export default class UploadCsvComponent extends Component<Args> {
    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: true,
        acceptDirectories: false,
    };

    @tracked dropping = false;
    @tracked uploading: any[] = [];
    @tracked filename = '';
    clickable = [];

    @action
    buildUrl(files: any) {
        return `${apiUrl}/_/registries/${this.args.providerId}/bulk_create/${files[0].name}/`;
    }

    @action
    addedFile(_: any, __: any, file: any) {
        this.uploading.push(file);
    }

    @action
    uploadProgress(_: any, __: any, file: any, progress: number) {
        $(`#uploading-${file.size}`).css('width', `${progress}%`);
    }

    @action
    error(_: any, __: any, file: any, ___: any) {
        this.uploading.removeObject(file);
        // some error handling code here
    }

    @action
    success(_: any, __: any, file: any, ___: any) {
        this.uploading.removeObject(file);
        // some success handling code here
    }
}
