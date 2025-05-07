// import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import GoogleFilePickerWidget from 'osf-components/components/google-file-picker-widget/component';
import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';

interface Args {
    manager: StorageManager;
    configuredStorageAddon: ConfiguredStorageAddonModel;
}

export default class FileBrowser extends Component<Args> {
    @tracked createFolderModalOpen = false;
    @tracked googlePickerComponent: GoogleFilePickerWidget | null = null;
    @tracked dropzoneClickableElementId = '';
    @tracked isWBGoogleDrive = false;

    constructor(owner: unknown, args: Args) {
        super(owner, args);

        taskFor(this.loadExternalStorageService).perform();
    }

    /**
     * This is called only to authorize because the current implementation will throw an
     * error because the "root folder" is not yet set.
     */
    @task
    @waitFor
    async loadExternalStorageService() {
        const external = await this.args.configuredStorageAddon?.externalStorageService;
        this.isWBGoogleDrive = external?.wbKey === 'googledrive';
    }

    get isGoogleDrive(): boolean {
        return this.isWBGoogleDrive;
    }

    @action
    registerChild(child: GoogleFilePickerWidget) {
        this.googlePickerComponent = child; // Store the child's instance
    }

    @action
    openGoogleFilePicker(dropdown: any) {
        dropdown.close();
        if (this.googlePickerComponent) {
            this.googlePickerComponent.openPicker();
        }
    }
}
