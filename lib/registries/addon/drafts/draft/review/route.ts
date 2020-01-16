import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

import { DraftRoute } from 'registries/drafts/draft/navigation-manager';
import { DraftRouteModel } from '../route';

export default class DraftRegistrationReview extends Route {
    @service analytics!: Analytics;

    model(): DraftRouteModel {
        const draftRouteModel = this.modelFor('drafts.draft') as DraftRouteModel;
        const { navigationManager } = draftRouteModel;

        navigationManager.setPageAndRoute(DraftRoute.Review);

        return this.modelFor('drafts.draft') as DraftRouteModel;
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
