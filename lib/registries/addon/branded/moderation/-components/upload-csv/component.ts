import config from 'ember-get-config';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { SafeString } from '@ember/template/-private/handlebars';
import Toast from 'ember-toastr/services/toast';

const { OSF: { apiUrl } } = config;

interface Args {
    providerId: string;
}

interface ErrorMessage {
    cell: string;
    title: string;
    detail: string | SafeString;
}
interface ApiErrorDetail {
    header: string;
    column_index: string;
    row_index: string;
    type: string;
}
export default class UploadCsvComponent extends Component<Args> {
    dropzoneOptions = {
        createImageThumbnails: false,
        method: 'PUT',
        withCredentials: true,
        preventMultipleFiles: true,
        acceptDirectories: false,
    };

    @service intl!: Intl;
    @service toast!: Toast;

    @tracked errorMessages: ErrorMessage[] = [];
    @tracked shouldShowErrorModal = false;
    @tracked uploading: any[] = [];

    @action
    buildUrl(files: any) {
        return `${apiUrl}/_/registries/${this.args.providerId}/bulk_create/${files[0].name}/`;
    }

    @action
    addedFile(_: any, __: any, file: any) {
        this.uploading.push(file);
    }

    @action
    error(_: any, __: any, file: any, { errors }: { errors: ApiErrorDetail[]}) {
        this.uploading.removeObject(file);
        this.shouldShowErrorModal = true;
        for (const error of errors) {
            this.errorMessages.push(
                {
                    cell: error.column_index + error.row_index,
                    title: this.intl.t(`registries.moderation.settings.${error.type}.title`),
                    detail: this.intl.t(`registries.moderation.settings.${error.type}.detail`, { htmlSafe: true }),
                },
            );
        }
    }

    @action
    success(_: any, __: any, file: any, ___: any) {
        this.uploading.removeObject(file);
        this.toast.success(this.intl.t('registries.moderation.settings.uploadSuccess'));
    }

    @action
    closeErrorModal() {
        this.shouldShowErrorModal = false;
        this.errorMessages = [];
    }

    @action
    async copyToClipboard(elementId: string) {
        const mainElement = document.getElementById(elementId);
        await navigator.clipboard.writeText(mainElement!.textContent!);
        this.toast.success(this.intl.t('registries.moderation.settings.copyToClipboardSuccess'));
    }
}
