import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import { BufferedChangeset } from 'ember-changeset/types';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import uniqueId from 'ember-osf-web/utils/unique-id';

import { FilesManager } from 'osf-components/components/files/manager/component';
import styles from './styles';
import template from './template';

const folderValidations: ValidationObject<NewFolder> = {
    name: [
        validatePresence({
            presence: true,
            allowBlank: false,
            allowNone: false,
            message: 'Folder name cannot be blank',
            type: 'blank',
        }),
    ],
};

interface NewFolder {
    name: string | null;
}

@tagName('')
@layout(template, styles)
export default class FilesMenu extends Component {
    @service toast!: Toast;
    @service intl!: Intl;
    @service store!: Store;

    filesManager!: FilesManager;

    // Private
    newFolderDialogIsOpen = false;
    uploadButtonClass = uniqueId(['dz-upload-button']);

    newFolder!: NewFolder;
    changeset!: BufferedChangeset;

    @alias('filesManager.canEdit') canEdit!: boolean;

    @computed('changeset.isInvalid', 'createFolder.isRunning')
    get shouldDisableButtons() {
        if (!this.changeset) {
            return false;
        }
        return this.changeset.isInvalid || taskFor(this.createFolder).isRunning;
    }

    @task
    @waitFor
    async createFolder(options: { onSuccess?: () => void }) {
        const { inRootFolder, currentFolder, fileProvider } = this.filesManager;
        const parentFolder = inRootFolder ? fileProvider : currentFolder;
        const { onSuccess } = options;

        const newFolderName = this.changeset.get('name');

        let newFolderId;
        try {
            ({ newFolderId } = await parentFolder.createFolder(newFolderName));
        } catch (error) {
            this.toast.error(
                error.responseJSON.message,
                this.intl.t('osf-components.files-widget.create_folder_failed'),
            );
            throw error;
        }
        const newFolder = await this.store.findRecord('file', newFolderId);
        const folder = inRootFolder ? fileProvider.rootFolder : currentFolder;

        if (onSuccess) {
            onSuccess();
        }

        folder.files.pushObject(newFolder);
    }

    beforeOpenDialog() {
        this.set('newFolder', { name: null });
        this.setProperties({
            changeset: buildChangeset(this.newFolder, folderValidations),
        });
    }

    @action
    closeDialog() {
        this.set('newFolderDialogIsOpen', false);
    }

    @action
    onCloseMenu(isUploading: boolean) {
        return !isUploading;
    }

    @action
    openDialog(options: { onOpenDialog?: () => void }) {
        const { onOpenDialog } = options;

        this.beforeOpenDialog();

        this.set('newFolderDialogIsOpen', true);

        if (onOpenDialog) {
            onOpenDialog();
        }
    }
}
