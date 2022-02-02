import { action } from '@ember/object';
import Component from '@glimmer/component';
import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';

interface Args {
    manager: OsfStorageManager;
}

export default class FileBrowser extends Component<Args> {
    @action
    noop() {
        // Nothing to see here.
    }
}
