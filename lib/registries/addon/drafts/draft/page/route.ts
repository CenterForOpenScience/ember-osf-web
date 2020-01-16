import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';
import { getPageIndex } from 'ember-osf-web/utils/page-param';

import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import NavigationManager, { DraftRoute } from 'registries/drafts/draft/navigation-manager';
import { DraftRouteModel } from '../route';

export interface DraftPageRouteModel {
    draftRegistrationManager: DraftRegistrationManager;
    navigationManager: NavigationManager;
    pageIndex?: number;
    page: string;
}

export default class DraftRegistrationPageRoute extends Route {
    @service analytics!: Analytics;

    model(params: { page: string }): DraftPageRouteModel {
        const { page } = params;
        const pageIndex = getPageIndex(page);
        const draftRouteModel = this.modelFor('drafts.draft') as DraftRouteModel;
        const { draftRegistrationManager, navigationManager } = draftRouteModel;

        assert('pageIndex must be defined on the Page route', typeof pageIndex !== 'undefined');
        navigationManager.setPageAndRoute(DraftRoute.Page, pageIndex as number);

        return {
            draftRegistrationManager,
            navigationManager,
            pageIndex,
            page,
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
