/* eslint-disable no-console */
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import FileProviderModel from 'ember-osf-web/models/file-provider';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { validatePresence } from 'ember-changeset-validations/validators';
import { ValidationObject } from 'ember-changeset-validations';
import Media from 'ember-responsive';

import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';

interface Args {
    manager: OsfStorageManager;
    provider: FileProviderModel;
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

export default class FileItem extends Component<Args> {
    @service media!: Media;

    @tracked renameModalOpen = false;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
    }

    fileRenameChangeset =  buildChangeset({
        fileName: null,
    }, RenameFormValidations);

    get isMobile() {
        return this.media.isMobile;
    }

    @action
    handleInput(event: any) {
        taskFor(this.args.manager.changeFilter).perform(event.target.value);
    }

    @action
    toggleRenameModal() {
        this.renameModalOpen = !this.renameModalOpen;
        console.log('Inside file item - is modal open? T/F', this.renameModalOpen);
    }

    @action
    openRenameModal() {
        this.renameModalOpen = true;
    }

    @action
    closeRenameModal() {
        console.log('Close rename modal in file item ');
        this.renameModalOpen = false;
    }
}
