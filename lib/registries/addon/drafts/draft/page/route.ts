import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TaskInstance } from 'ember-concurrency';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';
import { getPageIndex, getPageParam } from 'ember-osf-web/utils/page-param';

import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import NavigationManager, { DraftRoute } from 'registries/drafts/draft/navigation-manager';
import { DraftRouteModel } from '../route';

export interface DraftPageRouteModel {
    draftRegistrationManager: DraftRegistrationManager;
    navigationManager: NavigationManager;
    taskInstance: TaskInstance<{draftRegistration: DraftRegistration, node: NodeModel} | undefined>;
    pageIndex?: number;
}

export default class DraftRegistrationPageRoute extends Route {
    @service analytics!: Analytics;

    model(params: { page: string }, transition: Transition): DraftPageRouteModel {
        const { page } = params;
        const pageIndex = getPageIndex(page);
        const draftRouteModel = this.modelFor('drafts.draft') as DraftRouteModel;
        const { draftId, taskInstance } = draftRouteModel;
        const { draftRegistrationManager, navigationManager } = draftRouteModel;

        if (navigationManager.currentPageManager) {
            const { pageHeadingText } = navigationManager.currentPageManager;
            this.updateRoute(pageHeadingText!, page, draftId, pageIndex!);
        } else {
            // @ts-ignore -- Private API
            this.onPageNotFound(transition.intent.url);
        }

        navigationManager.setCurrentPage(pageIndex as number);
        navigationManager.setCurrentRoute(DraftRoute.Page);

        return {
            draftRegistrationManager,
            navigationManager,
            taskInstance,
            pageIndex,
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }

    @action
    updateRoute(headingText: string, page: string, draftId: string, pageIndex: number) {
        const regex = /^\d+-?$/;
        const shouldAppendPageSlug = regex.test(page);
        if (page && shouldAppendPageSlug) {
            const pageSlug = getPageParam(pageIndex, headingText);
            this.replaceWith('drafts.draft.page', draftId, pageSlug);
        }
    }

    @action
    onPageNotFound(intentUrl: string) {
        this.replaceWith('page-not-found', notFoundURL(intentUrl));
    }
}
