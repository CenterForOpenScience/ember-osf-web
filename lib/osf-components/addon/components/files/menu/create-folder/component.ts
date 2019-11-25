import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import { ChangesetDef } from 'ember-changeset/types';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

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
        }),
    ],
};

interface NewFolder {
    name: string | null;
}

@tagName('')
@layout(template, styles)
export default class CreateFolder extends Component.extend({
    createFolder: task(function *(this: CreateFolder, options: { onSuccess?: () => void }) {
        const { inRootFolder, currentFolder, fileProvider } = this.filesManager;
        const parentFolder = inRootFolder ? fileProvider : currentFolder;
        const { onSuccess } = options;

        const newFolderName = this.changeset.get('name');

        let newFolderId;
        try {
            ({ newFolderId } = yield parentFolder.createFolder(newFolderName));
        } catch (error) {
            this.toast.error(
                error.responseJSON.message,
                this.i18n.t('osf-components.files-widget.create_folder_failed'),
            );
            throw error;
        }
        const newFolder = yield this.store.findRecord('file', newFolderId);
        const folder = inRootFolder ? fileProvider.rootFolder : currentFolder;

        if (onSuccess) {
            onSuccess();
        }

        folder.files.pushObject(newFolder);
    }),
}) {
    @service toast!: Toast;
    @service i18n!: I18N;
    @service store!: DS.Store;

    filesManager!: FilesManager;
    newFolder: NewFolder = { name: null };
    changeset: ChangesetDef = buildChangeset(this.newFolder, folderValidations);

    @computed('changeset.isInvalid', 'createFolder.isRunning')
    get shouldDisableButtons() {
        return this.changeset.isInvalid || this.createFolder.isRunning;
    }
}
