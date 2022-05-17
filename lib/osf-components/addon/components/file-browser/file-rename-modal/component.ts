/* eslint-disable eqeqeq */
/* eslint-disable no-console */
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { validatePresence } from 'ember-changeset-validations/validators';
import { ValidationObject } from 'ember-changeset-validations';
import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';
import Toast from 'ember-toastr/services/toast';
import Store from '@ember-data/store';
import OsfAdapter from 'ember-osf-web/adapters/osf-adapter';
import CurrentUser from 'ember-osf-web/services/current-user';
import { restartableTask } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';
import Intl from 'ember-intl/services/intl';

interface Args {
    manager: OsfStorageManager;
    item: OsfStorageFile;
    // validateFileName: (
        //     fileName: string,
        // ) => void;
    }

interface RenameField {
    fileName: string;
}

const RenameFormValidations: ValidationObject<RenameField> = {
    fileName: validatePresence({
        presence: true,
        type: 'empty',
    }),
};

export default class FileRenameModal extends Component<Args> {
    @service route!: RouterService;
    @service toast!: Toast;
    @service store!: Store;
    @service osfadapter!: OsfAdapter;
    @service currentUser!: CurrentUser;
    @service intl!: Intl;

    @tracked renameModalOpen = false;
    @tracked disableButtons = false;
    @tracked newFileName?: string = '';
    @tracked disabled = true;

    fileRenameChangeset = buildChangeset({
        fileName: null,
    }, RenameFormValidations);

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.newFileName = this.args.item.name;
        console.log('Manager is:', this.args.manager);
        console.log('File is:', this.args.item);
    }

    @restartableTask
    @waitFor
    async validateFileName() {
        const input = document.getElementById('userInput');
        const newName = this.newFileName;
        if (input) {
            const inputValue = this.newFileName;
            const currentFileName = this.args.item.name;
            console.log('Input value from newFileName: ', inputValue);
            console.log('currentFileName: ', currentFileName);
            if (inputValue) {
                const noTrailingSpaceInput = inputValue.trim();

                if (inputValue == currentFileName || noTrailingSpaceInput == currentFileName ) {
                    this.disabled = true;
                    const errorMessage = this.intl.t('registries.overview.files.file_rename_modal.error_toast');
                    this.toast.error(errorMessage);
                    console.log('File name and user input SAME');
                } else {
                    this.disabled = false;
                    console.log('File name and user input DIFFERENT');
                    console.log('The new filename is:', newName);
                }
            }
            const renameButton = document.getElementById('renameButton');
            if (renameButton && this.disabled === true) {
                renameButton.disabled = true;
            } else if (renameButton) {
                renameButton.disabled = false;
            } else {
                this.toast.error(errorMessage);
            }
        }
    }

    @action
    clearChangeset() {
        this.fileRenameChangeset.rollback();
    }

    @action
    async updateFileName() {
        const newName = this.newFileName;
        console.log('newFileName is:', newName);
        // this.fileRenameChangeset.validate();
        // if (this.fileRenameChangeset.isInvalid) {
        //     return Promise.reject();
        // }
        // return Promise.resolve();
        // return newName;
        const successMessage = this.intl.t('registries.overview.files.file_rename_modal.success_toast');
        if (newName) {
            newName.trim();
            this.args.item.rename(newName, 'replace');
        }
        this.toast.success(successMessage);
        return newName;
    }

    @action
    clearField() {
        console.log('Inside clear field function.');
        const input = document.getElementById('userInput');
        if (input) {
            console.log(input);
            input.value = '';
        }
    }
}
