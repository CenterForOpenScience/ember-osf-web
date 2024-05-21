import { action } from '@ember/object';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';

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
    buildUrl(files: any[]): string {
        const { name } = files[0];
        const url = new URL(this.args.preprint.files.firstObject!.links.upload as string);
        url.searchParams.append('kind', 'file');
        url.searchParams.append('name', name);
        return url.toString();
    }

    @task
    @waitFor
    async createPreprint() {
        await this.args.preprint.save();
        await this.args.preprint.files;
    }
}
