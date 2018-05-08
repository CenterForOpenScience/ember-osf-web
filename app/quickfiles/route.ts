import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Ember from 'ember';
import requireLogin from 'ember-osf-web/mixins/require-login';
import CurrentUser from 'ember-osf-web/services/current-user';

@requireLogin()
class Quickfiles extends Route {
    @service currentUser!: CurrentUser;

    model(this: Quickfiles) {
        return this.currentUser.currentUserId;
    }

    afterModel(model: any, transition: Ember.Transition) {
        if (model) {
            transition.abort();
            return this.transitionTo('guid-user.quickfiles', model);
        }
        return super.afterModel(model, transition);
    }
}

export default Quickfiles;
