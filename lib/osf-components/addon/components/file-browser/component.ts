import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { taskFor } from 'ember-concurrency-ts';
import Media from 'ember-responsive';

import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';

interface Args {
    manager: OsfStorageManager;
}

export default class FileBrowser extends Component<Args> {
    @service media!: Media;

    get isMobile() {
        return this.media.isMobile;
    }

    @action
    handleInput(event: any) {
        taskFor(this.args.manager.changeFilter).perform(event.target.value);
    }
}
