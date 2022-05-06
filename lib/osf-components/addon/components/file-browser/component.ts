import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import Media from 'ember-responsive';

import OsfStorageManager from 'osf-components/components/storage-provider-manager/osf-storage-manager/component';

interface Args {
    manager: OsfStorageManager;
    selectable?: boolean;
}

export default class FileBrowser extends Component<Args> {
    @service media!: Media;

    @tracked helpModalOpen = false;
    @tracked selectable = this.args.selectable || false;
    @tracked moveModalOpen = false;

    get isMobile() {
        return this.media.isMobile;
    }

    @action
    handleInput(event: any) {
        taskFor(this.args.manager.changeFilter).perform(event.target.value);
    }

    @action
    toggleHelpModal() {
        this.helpModalOpen = !this.helpModalOpen;
    }

    @action
    toggleMoveModal() {
        this.moveModalOpen = !this.moveModalOpen;
    }
}
