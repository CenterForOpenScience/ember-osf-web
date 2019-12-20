import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import Analytics from 'ember-osf-web/services/analytics';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

import { DraftRouteModel } from '../route';
import MetadataController from './controller';

export default class DraftRegistrationMetadataRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    async model(): Promise<DraftRegistrationModel> {
        const draftRouteModel = this.modelFor('drafts.draft') as DraftRouteModel;
        const { draftRegistration } = await draftRouteModel.taskInstance;
        return draftRegistration;
    }

    setupController(controller: MetadataController) {
        const changeset = buildChangeset(this.model, {});
        controller.set('changeset', changeset);
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
