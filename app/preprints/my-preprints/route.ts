import Route from '@ember/routing/route';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import CurrentUser from 'ember-osf-web/services/current-user';

@requireAuth()
export default class PreprintsMyPreprintsRoute extends Route {
    @service store!: Store;
    @service currentUser!: CurrentUser;

    async model() {
        return this.currentUser.user;
    }
}
