import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import CasAuthenticatedRouteMixin from 'ember-osf-web/mixins/cas-authenticated-route';

export default class Quickfiles extends Route.extend(CasAuthenticatedRouteMixin) {
    currentUser = service('currentUser');

    model() {
        return this.get('currentUser').get('currentUserId');
    }

    afterModel(model, transition) {
        if (model) {
            transition.abort();
            return this.transitionTo('guid-user.quickfiles', model);
        }
    }
}
