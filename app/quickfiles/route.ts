import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import CasAuthenticatedRouteMixin from 'ember-osf-web/mixins/cas-authenticated-route';

export default class Quickfiles extends Route.extend(CasAuthenticatedRouteMixin) {
    @service currentUser;

    model(this: Quickfiles) {
        return this.get('currentUser').get('currentUserId');
    }

    afterModel(model, transition) {
        if (model) {
            transition.abort();
            return this.transitionTo('guid-user.quickfiles', model);
        }
    }
}
