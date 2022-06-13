import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import File from 'ember-osf-web/packages/files/file';
import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';

interface Args {
    item: File;
    manager: StorageManager;
}

export default class FolderItem extends Component<Args> {
    @service media!: Media;

    @tracked isDeleteModalOpen = false;
    @tracked moveModalOpen = false;
    @tracked useCopyModal = false;
    @tracked renameModalOpen = false;

    get showActionsDropdown() {
        const { item, manager } = this.args;
        return (item.userCanDownloadAsZip || item.currentUserCanDelete) && manager.selectedFiles.length === 0;
    }
}
