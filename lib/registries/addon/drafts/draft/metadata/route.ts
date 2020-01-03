import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import Analytics from 'ember-osf-web/services/analytics';

import { DraftRouteModel } from '../route';

export default class DraftRegistrationMetadataRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    model(): DraftRouteModel {
        return this.modelFor('drafts.draft') as DraftRouteModel;
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
