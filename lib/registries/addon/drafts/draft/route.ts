import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { task, TaskInstance } from 'ember-concurrency';
import DS from 'ember-data';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Analytics from 'ember-osf-web/services/analytics';

import { getPageIndex } from 'ember-osf-web/utils/page-param';

export interface DraftRouteModel {
    taskInstance: TaskInstance<DraftRegistration>;
    pageIndex?: number;
    page: string;
}

@requireAuth()
export default class DraftRegistrationRoute extends Route.extend({
    loadModelTask: task(function *(this: DraftRegistrationRoute, draftId: string) {
        try {
            const draftRegistration = yield this.store.findRecord(
                'draft-registration',
                draftId,
                { adapterOptions: { include: 'branched_from' } },
            );
            const node = yield draftRegistration.branchedFrom;
            yield node.loadRelatedCount('children');
            return { draftRegistration, node };
        } catch (error) {
            this.transitionTo('page-not-found', this.router.currentURL.slice(1));
            return undefined;
        }
    }),
}) {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    model(params: { id: string, page: string }): DraftRouteModel {
        const { id: draftId, page } = params;
        const pageIndex = getPageIndex(page);

        return {
            taskInstance: this.loadModelTask.perform(draftId),
            pageIndex,
            page,
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
