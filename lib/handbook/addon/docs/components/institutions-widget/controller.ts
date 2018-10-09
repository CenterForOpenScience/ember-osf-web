import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class InstitutionsWidget extends Controller {
    @service currentUser!: CurrentUser;
}
