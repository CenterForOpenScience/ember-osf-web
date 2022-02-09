import { action } from '@ember/object';
import Component from '@glimmer/component';
import { taskFor } from 'ember-concurrency-ts';
import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';

interface Args {
    manager: OsfStorageManager;
}

export default class FileBrowser extends Component<Args> {
    @action
    handleInput(event: any) {
        taskFor(this.args.manager.changeFilter).perform(event.target.value);
    }
}
