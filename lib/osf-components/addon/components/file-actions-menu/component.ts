import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import File from 'ember-osf-web/packages/files/file';

interface Args {
    item: File;
}

export default class CreateFolderModal extends Component<Args> {
    @tracked isDeleteModalOpen = false;

    @action
    closeDeleteModal() {
        this.isDeleteModalOpen = false;
    }
}
