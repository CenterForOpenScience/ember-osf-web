import { service } from '@ember-decorators/service';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import CurrentUser from 'ember-osf-web/services/current-user';

@requireAuth()
export default class Quickfiles extends Route {
    @service currentUser!: CurrentUser;

    model(this: Quickfiles) {
        return this.currentUser.currentUserId;
    }

    afterModel(model: any, transition: Transition) {
        if (model) {
            return this.transitionTo('guid-user.quickfiles', model);
        }
        return super.afterModel(model, transition);
    }
}
