import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import { ReviewPermissions } from 'ember-osf-web/models/provider';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class BrandedModerationRoute extends Route {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUserService;
    @service router!: RouterService;
    @service store!: DS.Store;

    afterModel(model: RegistrationProviderModel) {
        const { user } = this.currentUser;
        if (!user || model.reviewsWorkflow !== 'pre-moderation'
            || !model.permissions.includes(ReviewPermissions.ViewSubmissions)) {
            this.transitionTo('page-not-found', window.location.pathname.slice(1));
        }
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
