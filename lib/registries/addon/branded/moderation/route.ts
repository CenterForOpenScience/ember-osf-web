import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class BrandedModerationRoute extends Route {
    @service currentUser!: CurrentUserService;
    @service router!: RouterService;
    @service store!: Store;

    afterModel(model: RegistrationProviderModel) {
        const { user } = this.currentUser;
        if (!user || model.reviewsWorkflow !== 'pre-moderation'
            || !model.currentUserCanReview) {
            this.transitionTo('page-not-found', window.location.pathname.slice(1));
        }
    }
}
