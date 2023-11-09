import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import File from 'ember-osf-web/packages/files/file';
import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';
import OsfStorageFile from 'ember-osf-web/packages/files/osf-storage-file';

interface Args {
    item: File;
    onDelete: () => void;
    manager?: StorageManager; // No manager for file-detail page
    addonsEnabled? : string[];
}

export default class FileActionsMenu extends Component<Args> {
    @service media!: Media;

    @tracked isDeleteModalOpen = false;
    @tracked moveModalOpen = false;
    @tracked useCopyModal = false;
    @tracked renameModalOpen = false;
    @tracked isSubmitToBoaModalOpen = false;

    @action
    closeDeleteModal() {
        this.isDeleteModalOpen = false;
    }

    @action
    closeRenameModal() {
        this.renameModalOpen = false;
    }

    @action
    openRenameModal() {
        this.renameModalOpen = true;
    }

    @action
    closeSubmitToBoaModal() {
        this.isSubmitToBoaModalOpen = false;
    }

    @action
    openSubmitToBoaModal() {
        this.isSubmitToBoaModalOpen = true;
    }

    get isBoaEnabled() {
        return this.args.addonsEnabled?.includes('boa');
    }

    get showSubmitToBoa() {
        const { item, manager } = this.args;
        if (item.providerIsOsfstorage) {
            let userCanUploadToHere;
            if (manager) {
                userCanUploadToHere = manager.currentFolder.userCanUploadToHere;
            } else {
                const parentFolder = new OsfStorageFile(item.currentUser, item.fileModel.get('parentFolder'));
                userCanUploadToHere = parentFolder.userCanUploadToHere;
            }
            return this.isBoaEnabled && item.isBoaFile && userCanUploadToHere;
        }
        return false;
    }
}
