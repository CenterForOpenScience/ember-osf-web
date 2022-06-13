// import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import StorageManager from 'osf-components/components/storage-provider-manager/storage-manager/component';

interface Args {
    manager: StorageManager;
}

export default class FileBrowser extends Component<Args> {
    @tracked createFolderModalOpen = false;
    @tracked dropzoneClickableElementId = '';
}
