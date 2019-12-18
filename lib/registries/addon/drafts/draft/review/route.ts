import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { TaskInstance } from 'ember-concurrency';
import DS from 'ember-data';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';

import { DraftRegistrationManager } from 'registries/drafts/draft/draft-registration-manager';
import { DraftRouteModel } from '../route';

export interface DraftReviewModel {
    draftRegistrationManager: DraftRegistrationManager;
    taskInstance: TaskInstance<{
        draftRegistration: DraftRegistration,
        node: NodeModel,
    } | undefined>;
}

export default class DraftRegistrationReview extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    model(): DraftReviewModel {
        const draftRouteModel = this.modelFor('drafts.draft') as DraftRouteModel;
        const { taskInstance } = draftRouteModel;
        const { draftRegistrationManager } = draftRouteModel;
        return {
            draftRegistrationManager,
            taskInstance,
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
