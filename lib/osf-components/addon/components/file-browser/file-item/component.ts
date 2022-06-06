import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { taskFor } from 'ember-concurrency-ts';
import FileProviderModel from 'ember-osf-web/models/file-provider';

import { Route } from '@ember/routing';

interface Args {
    manager: StorageManager;
    provider: FileProviderModel;
}

export default class FileItem extends Component<Args> {
    @service route!: Route;

    @tracked renameModalOpen = false;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
    }

    @action
    handleInput(event: any) {
        taskFor(this.args.manager.changeFilter).perform(event.target.value);
    }

    @action
    toggleRenameModal() {
        this.renameModalOpen = !this.renameModalOpen;
    }

    @action
    openRenameModal() {
        this.renameModalOpen = true;
    }

    @action
    closeRenameModal() {
        this.renameModalOpen = false;
    }
}
