import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';

interface Args {
    manager: StorageManager;
    isOpen: boolean;
}

export default class CreateFolderModal extends Component<Args> {
    @tracked newFolderName = '';
}
