import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';
import { RevisionRoute } from 'registries/edit-revision/nav-manager';

import { EditRevisionRouteModel } from '../route';

export default class EditRevisionReview extends Route {
    @service analytics!: Analytics;

    model(): EditRevisionRouteModel {
        const editRevisionRouteModel = this.modelFor('edit-revision') as EditRevisionRouteModel;
        const { navigationManager } = editRevisionRouteModel;

        navigationManager.setPageAndRoute(RevisionRoute.Review);

        return this.modelFor('edit-revision') as EditRevisionRouteModel;
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
