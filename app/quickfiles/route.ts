import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Ember from 'ember';
import CasAuthenticatedRouteMixin from 'ember-osf-web/mixins/cas-authenticated-route';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class Quickfiles extends Route.extend(CasAuthenticatedRouteMixin) {
    @service currentUser!: CurrentUser;

    model(this: Quickfiles) {
        return this.get('currentUser').get('currentUserId');
    }

    afterModel(model: any, transition: Ember.Transition) {
        if (model) {
            transition.abort();
            return this.transitionTo('guid-user.quickfiles', model);
        }
        return super.afterModel(model, transition);
    }
}
