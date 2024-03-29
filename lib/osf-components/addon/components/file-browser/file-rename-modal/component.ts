import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Toast from 'ember-toastr/services/toast';
import { restartableTask } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import Intl from 'ember-intl/services/intl';

import { forbiddenFileNameCharacters } from 'ember-osf-web/models/file';
import File from 'ember-osf-web/packages/files/file';
import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';

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
        if(this.newFileName && !this.containsForbiddenChars && !this.endsWithDot) {
            return (this.newFileName.trim() !== this.originalFileName && this.newFileName.trim() !== '');
        }
        return false;
    }

    get containsForbiddenChars() {
        return this.newFileName && forbiddenFileNameCharacters.test(this.newFileName);
    }

    get endsWithDot() {
        return this.newFileName && this.newFileName.endsWith('.');
    }

    get errorText() {
        let errorTextKey = 'osf-components.file-browser.file_rename_modal.error_';
        if (!this.newFileName) {
            errorTextKey += 'empty_name';
        } else if (this.endsWithDot) {
            errorTextKey += 'ends_with_dot';
        } else if (this.containsForbiddenChars) {
            errorTextKey += 'forbidden_chars';
        } else {
            errorTextKey += 'message';
        }
        return this.intl.t(errorTextKey);
    }

    @action
    resetFileNameValue() {
        this.newFileName = this.originalFileName;
    }

    @restartableTask
    @waitFor
    async updateFileName() {
        const newName = this.newFileName;
        const successMessage = this.intl.t('osf-components.file-browser.file_rename_modal.success_message');
        if (!this.isValid) {
            return;
        }

        try {
            const trimmedName = newName!.trim();
            await this.args.item.rename(trimmedName, '');
            this.toast.success(successMessage);
            this.args.manager.reload();
        } catch(e) {
            this.toast.error(this.intl.t('osf-components.file-browser.file_rename_modal.retry_message'));
        }
        return newName;
    }
}
