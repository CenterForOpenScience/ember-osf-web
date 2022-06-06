import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


import Toast from 'ember-toastr/services/toast';
import Store from '@ember-data/store';
import CurrentUser from 'ember-osf-web/services/current-user';
import { restartableTask } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import Intl from 'ember-intl/services/intl';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';

interface Args {
    manager: StorageManager;
    item: OsfStorageFile;
}

export default class FileRenameModal extends Component<Args> {
    @service toast!: Toast;
    @service store!: Store;
    @service currentUser!: CurrentUser;
    @service intl!: Intl;

    @tracked renameModalOpen = false;
    @tracked disableButtons = false;
    @tracked currentFileName?: string;
    @tracked newFileName?: string;
    @tracked disabled = true;
    @tracked originalFileName?: string;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.newFileName = this.args.item.name;
        this.originalFileName = this.args.item.name;
    }

    @restartableTask
    @waitFor
    async validateFileName() {
        const input: HTMLInputElement = (document.getElementById('userInput') as HTMLInputElement);
        const errorMessage = this.intl.t('osf-components.file-browser.file_rename_modal.error_message');
        if (input) {
            const inputValue = this.newFileName;
            const currentFileName = this.args.item.name;

            if (inputValue) {
                const noTrailingSpaceInput = inputValue.trim();
                if (inputValue === currentFileName || noTrailingSpaceInput === currentFileName) {
                    this.disabled = true;
                    this.toast.error(errorMessage);
                } else {
                    this.disabled = false;
                }
            }
        }
    }

    @action
    resetFileNameValue() {
        this.currentFileName =  this.originalFileName;
    }

    @action
    async updateFileName() {
        const newName = this.newFileName;
        const successMessage = this.intl.t('osf-components.file-browser.file_rename_modal.success_message');
        if (!newName) {
            return;
        }

        try {
            newName.trim();
            this.args.item.rename(newName, 'replace');
            this.toast.success(successMessage);
            this.disabled = true;
        } catch(e) {
            this.toast.error(this.intl.t('osf-components.file-browser.file_rename_modal.retry_message'));
        }
        return newName;
    }
}
