import { action } from '@ember/object';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import FileModel from 'ember-osf-web/models/file';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { taskFor } from 'ember-concurrency-ts';

interface PreprintUploadArgs {
    manager: PreprintStateMachine;
    preprint: PreprintModel;
    allowVersioning: boolean;
    validate: (_: FileModel) => {};
    clickableElementId: string;
    dragEnter: () => {};
    dragLeave: () => {};
    dragOver: () => {};
}


export default class PreprintUpload extends Component<PreprintUploadArgs> {
    @service intl!: Intl;
    @service toast!: Toast;
    url?: URL;
    rootFolder?: FileModel;

    constructor(owner: unknown, args: any) {
        super(owner, args);

        taskFor(this.prepUrl).perform();
    }

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
            preventMultipleFiles: true,
            acceptDirectories: false,
            autoProcessQueue: true,
            autoQueue: true,
            parallelUploads: uploadLimit,
            maxFilesize: 10000000,
            timeout: null,
        };
    }

    @task
    @waitFor
    async prepUrl() {
        const theFiles = await this.args.preprint.files;
        const rootFolder = await theFiles.firstObject!.rootFolder;
        const urlString = await theFiles.firstObject!.links.upload as string;
        const url = new URL( urlString );
        this.url = url;
        this.rootFolder = rootFolder;
    }

    @action
    buildUrl(files: any[]): string {
        const { name } = files[0];
        this.url!.searchParams.append('kind', 'file');
        this.url!.searchParams.append('name', name);
        return this.url!.toString();
    }

    @task
    @waitFor
    async success(_: any, __:any, file: FileModel): Promise<void> {
        const primaryFile = await this.rootFolder!.files;
        this.args.manager.preprint.set('primaryFile', primaryFile.firstObject);
        await this.args.manager.preprint.save();
        this.args.validate(file);
    }
}
