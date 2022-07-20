import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { forbiddenFileNameCharacters } from 'ember-osf-web/models/file';
import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';

interface Args {
    manager: StorageManager;
    isOpen: boolean;
}

export default class CreateFolderModal extends Component<Args> {
    @service intl!: Intl;
    @tracked newFolderName = '';

    get isInvalid() {
        const trimmedName = this.newFolderName.trim();
        return !trimmedName || this.containsForbiddenChars || this.endsWithDot;
    }

    get containsForbiddenChars() {
        return this.newFolderName && forbiddenFileNameCharacters.test(this.newFolderName);
    }

    get endsWithDot() {
        return this.newFolderName && this.newFolderName.endsWith('.');
    }

    get errorText() {
        let errorTextKey = 'osf-components.file-browser.create_folder.error_';
        if (this.containsForbiddenChars) {
            errorTextKey += 'forbidden_chars';
        } else if (this.endsWithDot) {
            errorTextKey += 'ends_with_dot';
        } else {
            errorTextKey += 'message';
        }
        return this.intl.t(errorTextKey);
    }
}
