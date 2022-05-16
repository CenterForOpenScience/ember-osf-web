import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import File from 'ember-osf-web/packages/files/file';
import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';

interface Args {
    item: File;
    manager: OsfStorageManager; // type
}

export default class FolderItem extends Component<Args> {
    @tracked moveModalOpen = false;

    @action
    toggleMoveModal() {
        this.moveModalOpen = !this.moveModalOpen;
    }
}
