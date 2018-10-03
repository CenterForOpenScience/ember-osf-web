import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Ember from 'ember';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import CurrentUser from 'ember-osf-web/services/current-user';

@requireAuth()
export default class Quickfiles extends Route {
    @service currentUser!: CurrentUser;

    model(this: Quickfiles) {
        return this.currentUser.currentUserId;
    }

    afterModel(model: any, transition: Ember.Transition) {
        if (model) {
            return this.transitionTo('guid-user.quickfiles', model);
        }
        return super.afterModel(model, transition);
    }
}
