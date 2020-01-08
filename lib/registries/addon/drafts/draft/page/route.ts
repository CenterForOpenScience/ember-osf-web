import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TaskInstance } from 'ember-concurrency';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import { getPageIndex } from 'ember-osf-web/utils/page-param';

import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import NavigationManager, { DraftRoute } from 'registries/drafts/draft/navigation-manager';
import { DraftRouteModel } from '../route';

export interface DraftPageRouteModel {
    draftRegistrationManager: DraftRegistrationManager;
    navigationManager: NavigationManager;
    taskInstance: TaskInstance<{draftRegistration: DraftRegistration, node: NodeModel} | undefined>;
    pageIndex?: number;
    page: string;
}

export default class DraftRegistrationPageRoute extends Route {
    @service analytics!: Analytics;

    model(params: { page: string }): DraftPageRouteModel {
        const { page } = params;
        const pageIndex = getPageIndex(page);
        const draftRouteModel = this.modelFor('drafts.draft') as DraftRouteModel;
        const { taskInstance } = draftRouteModel;
        const { draftRegistrationManager, navigationManager } = draftRouteModel;

        navigationManager.setCurrentPage(pageIndex as number);
        navigationManager.setCurrentRoute(DraftRoute.Page);

        return {
            draftRegistrationManager,
            navigationManager,
            taskInstance,
            pageIndex,
            page,
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
