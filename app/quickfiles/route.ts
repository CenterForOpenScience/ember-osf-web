import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import CasAuthenticatedRouteMixin from 'ember-osf/mixins/cas-authenticated-route';

export default class Quickfiles extends Route.extend(CasAuthenticatedRouteMixin, {
    async beforeModel(this: Quickfiles, transition) {
        await this._super(transition);
        this.transitionTo('user-quickfiles', this.get('currentUser').get('currentUserId'));
    },
}) {
    private currentUser = service('currentUser');
}

declare module '@ember/routing/route' {
    interface IRegistry {
        quickfiles: Quickfiles;
    }
}
