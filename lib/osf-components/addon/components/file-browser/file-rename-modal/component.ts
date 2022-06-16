import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Toast from 'ember-toastr/services/toast';
import { restartableTask } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import Intl from 'ember-intl/services/intl';
import File from 'ember-osf-web/packages/files/file';

interface Args {
    manager: StorageManager;
    item: File;
}

export default class FileRenameModal extends Component<Args> {
    @service toast!: Toast;
    @service intl!: Intl;

    @tracked newFileName?: string;
    @tracked originalFileName?: string;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.newFileName = this.args.item.name;
        this.originalFileName = this.args.item.name;
    }

    get isValid() {
        return this.newFileName !== this.originalFileName;
    }

    @action
    resetFileNameValue() {
        return this.newFileName =  this.originalFileName;
    }

    updateOriginalName(newName: string) {
        return this.originalFileName =  newName;
    }

    @restartableTask
    @waitFor
    async updateFileName() {
        const newName = this.newFileName;
        const successMessage = this.intl.t('osf-components.file-browser.file_rename_modal.success_message');
        if (!newName) {
            return;
        }

        try {
            const trimmedName = newName.trim();
            await this.args.item.rename(trimmedName, '');
            this.toast.success(successMessage);
        } catch(e) {
            this.toast.error(this.intl.t('osf-components.file-browser.file_rename_modal.retry_message'));
        }
        this.originalFileName = newName;
        return newName;
    }
}
