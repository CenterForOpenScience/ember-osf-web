import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import Analytics from 'ember-osf-web/services/analytics';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class BrandedModerationRoute extends Route {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUserService;
    @service router!: RouterService;
    @service store!: DS.Store;

    model() {
        return this.modelFor('branded');
    }

    // TODO: Uncomment this when we can have current user who is a moderator for a provider
    // afterModel() {
    //     const { user } = this.currentUser;
    //     if (!user || !user.canViewReviews) {
    //         this.transitionTo('page-not-found', window.location.pathname.slice(1));
    //     }
    // }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
