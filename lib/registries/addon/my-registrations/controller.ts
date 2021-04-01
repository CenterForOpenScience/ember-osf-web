import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import CurrentUserService from 'ember-osf-web/services/current-user';

export default class MyRegistrationsController extends Controller {
    @service currentUser!: CurrentUserService;
}
