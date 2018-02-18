import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import CasAuthenticatedRouteMixin from 'ember-osf/mixins/cas-authenticated-route';

export default class Quickfiles extends Route.extend(CasAuthenticatedRouteMixin) {
    currentUser = service('currentUser');

    model() {
        return this.get('currentUser').get('currentUserId');
    }

    afterModel(model) {
        if (model) {
            return this.transitionTo('user-quickfiles', model);
        }
    }
}

declare module '@ember/routing/route' {
    interface IRegistry {
        quickfiles: Quickfiles;
    }
}
