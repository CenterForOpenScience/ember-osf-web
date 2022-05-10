import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';

interface Args {
    manager: OsfStorageManager;
    isOpen: boolean;
}

export default class CreateFolderModal extends Component<Args> {
    @tracked newFolderName = '';
}
