// import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
// import { taskFor } from 'ember-concurrency-ts';
// import Media from 'ember-responsive';

import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';

interface Args {
    manager: OsfStorageManager;
}

export default class FileBrowser extends Component<Args> {
    @tracked createFolderModalOpen = false;
    @tracked uploadModalOpen = false;
}
