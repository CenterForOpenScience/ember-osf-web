import Store from '@ember-data/store';
import { computed } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';

// eslint-disable-next-line ember/no-mixins
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import CollectionSubmission from 'ember-osf-web/models/collection-submission';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';

import SubmissionController from './controller';

interface TaskInstanceResult {
    provider: CollectionProvider;
    collection: Collection;
    collectionSubmission: CollectionSubmission;
}

@requireAuth()
export default class Submit extends Route.extend(ConfirmationMixin) {
    @service currentUser!: CurrentUser;
    @service store!: Store;
    @service theme!: Theme;
    @service intl!: Intl;

    // This tells ember-onbeforeunload what to use as the body for the warning before leaving the page.
    confirmationMessage = this.intl.t('collections.collections_submission.warning_body');

    @task
    @waitFor
    async loadModel() {
        const provider = this.theme.provider as CollectionProvider;
        const collection = await provider.primaryCollection;

        const collectionSubmission = this.store.createRecord('collection-submission', {
            collection,
            creator: this.currentUser.user,
        });

        return {
            provider,
            collection,
            collectionSubmission,
        } as TaskInstanceResult;
    }

    model() {
        return {
            taskInstance: taskFor(this.loadModel).perform() as Promise<TaskInstanceResult>,
        };
    }

    // This tells ember-onbeforeunload's ConfirmationMixin whether or not to stop transitions
    @computed('controller.isPageDirty')
    get isPageDirty() {
        const controller = this.controller as SubmissionController;
        return () => controller.isPageDirty;
    }
}
