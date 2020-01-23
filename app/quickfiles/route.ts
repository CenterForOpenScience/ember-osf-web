import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import CurrentUser from 'ember-osf-web/services/current-user';

@requireAuth()
export default class Quickfiles extends Route {
    @service currentUser!: CurrentUser;

    model() {
        return this.currentUser.currentUserId;
    }

    afterModel(model: any, transition: Transition) {
        if (model) {
            return this.transitionTo('guid-user.quickfiles', model);
        }
        return super.afterModel(model, transition);
    }
}
