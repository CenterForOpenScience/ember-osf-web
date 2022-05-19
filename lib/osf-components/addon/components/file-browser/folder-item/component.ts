import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import File from 'ember-osf-web/packages/files/file';
import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';

interface Args {
    item: File;
    manager: StorageManager;
}

export default class FolderItem extends Component<Args> {
    @tracked moveModalOpen = false;

    get showActionsDropdown() {
        const { item, manager } = this.args;
        return item.userCanDownloadAsZip && manager.selectedFiles.length === 0;
    }
}
