import Ember from 'ember';

import CasAuthenticatedRouteMixin from 'ember-osf/mixins/cas-authenticated-route';

export default Ember.Route.extend(CasAuthenticatedRouteMixin, {
    currentUser: Ember.inject.service('currentUser'),
    beforeModel(transition) {
        this._super(transition);
        this.transitionTo('user-quickfiles', this.get('currentUser').get('currentUserId'));
    }
});
