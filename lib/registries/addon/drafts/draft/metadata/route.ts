import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import Analytics from 'ember-osf-web/services/analytics';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

import { DraftRoute } from 'registries/drafts/draft/navigation-manager';
import { DraftRouteModel } from '../route';
import Controller from './controller';

export enum MetadataProperties {
    Title = 'title',
    Description = 'description',
    Tags = 'tags',
    Category = 'category',
    NodeLicense = 'nodeLicense',
}

export default class DraftRegistrationMetadataRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    model(): DraftRouteModel {
        const draftRouteModel = this.modelFor('drafts.draft') as DraftRouteModel;
        const { navigationManager } = draftRouteModel;

        navigationManager.setPageAndRoute(DraftRoute.Metadata);
        return draftRouteModel;
    }

    setupController(controller: Controller, model: DraftRouteModel) {
        super.setupController(controller, model);
        const changeset = buildChangeset(model, {});
        controller.set('changeset', changeset);
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
