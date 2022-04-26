import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';

interface Args {
    manager: OsfStorageManager;
    isOpen: boolean;
}

export default class UploadModal extends Component<Args> {
    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: false,
        acceptDirectories: false,
    };

    @service intl!: Intl;
    @service toast!: Toast;

    // @tracked errorMessages: ErrorMessage[] = [];
    // @tracked shouldShowErrorModal = false;
    @tracked uploading: any[] = [];

    @action
    buildUrl(files: any[]) {
        const { name } = files[0];
        return `${this.args.manager.currentFolder.links.upload}?${$.param({ kind: 'file', name })}`;
    }

    @action
    addedFile(_: any, __: any, file: any) {
        this.uploading.push(file);
    }

    @action
    error(_: any, __: any, file: any, { errors }: { errors: ApiErrorDetail[]}) {
        this.uploading.removeObject(file);
    }

    @action
    success(_: any, __: any, file: any, ___: any) {
        this.uploading.removeObject(file);
        // this.toast.success(this.intl.t('registries.moderation.settings.uploadSuccess'));
    }
}
