import Route from '@ember/routing/route';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

import CollectionProviderModel from 'ember-osf-web/models/collection-provider';
import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import Theme from 'ember-osf-web/services/theme';

import CollectionsModerationAllController from './controller';

export default class ModerationAll extends Route {
    @service store!: Store;
    @service theme!: Theme;

    model() {
        const provider = this.theme.provider as CollectionProviderModel;
        return provider.primaryCollection;

    }

    setupController(
        controller: CollectionsModerationAllController,
        _: any,
        __: any,
    ) {
        super.setupController(controller, _, __);
        const { state } = controller;
        if (!state || ![CollectionSubmissionReviewStates.Accepted,
            CollectionSubmissionReviewStates.Pending,
            CollectionSubmissionReviewStates.Rejected,
            CollectionSubmissionReviewStates.Removed].includes(state)) {
            controller.set('state', CollectionSubmissionReviewStates.Pending);
        }
    }
}
