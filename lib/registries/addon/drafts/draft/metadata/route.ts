import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import { DraftRoute } from 'registries/drafts/draft/navigation-manager';
import { DraftRouteModel } from '../route';

export default class DraftRegistrationMetadataRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    model(): DraftRouteModel {
        const draftRouteModel = this.modelFor('drafts.draft') as DraftRouteModel;
        const { navigationManager } = draftRouteModel;

        navigationManager.setPageAndRoute(DraftRoute.Metadata);
        return draftRouteModel;
    }
}
