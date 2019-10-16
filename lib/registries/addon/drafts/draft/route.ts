import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import Analytics from 'ember-osf-web/services/analytics';

import { getPageIndex, getPageParam } from 'ember-osf-web/utils/page-param';

@requireAuth()
export default class DraftRegistrationRoute extends Route.extend({
    loadModelTask: task(function *(this: DraftRegistrationRoute, draftId: string) {
        try {
            return yield this.store.findRecord('draft-registration', draftId);
        } catch (error) {
            this.transitionTo('page-not-found', this.router.currentURL.slice(1));
            return undefined;
        }
    }),
}) {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    page!: string;
    draftId!: string;
    pageIndex!: number;

    model(this: DraftRegistrationRoute, params: { id: string, page: string }) {
        const { id: draftId, page } = params;
        const pageIndex = getPageIndex(page);

        this.setProperties({
            page,
            pageIndex,
            draftId,
        });

        return {
            taskInstance: this.loadModelTask.perform(draftId),
            pageIndex,
            page,
        };
    }

    @action
    updateRoute(headingText: string) {
        if (this.page) {
            const pageSlug = getPageParam(this.pageIndex, headingText);
            this.replaceWith('drafts.draft', this.draftId, pageSlug);
        }
    }

    @action
    error() {
        this.replaceWith('page-not-found', this.router.currentURL.slice(1));
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
