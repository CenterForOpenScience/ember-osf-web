import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Node from 'ember-osf-web/models/node';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class NewProjectModalController extends Controller {
    @service currentUser!: CurrentUser;
    newNode: Node | null = null;
    shouldShowModal: boolean = false;
    shouldReload: boolean = false;

    // BEGIN-SNIPPET new-project-modal.controller.ts
    @action
    openModal(this: NewProjectModalController) {
        this.set('newNode', null);
        this.set('shouldShowModal', true);
    }

    @action
    projectCreated(this: NewProjectModalController, newNode: Node) {
        this.set('newNode', newNode);
        this.closeModal(true);
    }

    @action
    closeModal(this: NewProjectModalController, reload = false) {
        this.set('shouldShowModal', false);
        this.set('shouldReload', reload);
    }
    // END-SNIPPET
}
