import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class MyRegistrationsController extends Controller {
    @service currentUser!: CurrentUserService;

    queryParams = ['tab'];
    @tracked tab = 'submitted';

    @action
    changeTab(newTabId: number) {
        this.tab = newTabId === 1 ? 'submitted' : 'drafts';
    }
}
