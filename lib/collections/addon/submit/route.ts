import { computed } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { DS } from 'ember-data';
import Intl from 'ember-intl/services/intl';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';

import SubmissionController from './controller';

interface TaskInstanceResult {
    provider: CollectionProvider;
    collection: Collection;
    collectedMetadatum: CollectedMetadatum;
}

@requireAuth()
export default class Submit extends Route.extend(ConfirmationMixin) {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service theme!: Theme;
    @service intl!: Intl;

    // This tells ember-onbeforeunload what to use as the body for the warning before leaving the page.
    confirmationMessage = this.intl.t('collections.collections_submission.warning_body');

    @task
    async loadModel() {
        const provider = this.theme.provider as CollectionProvider;
        const collection = await provider.primaryCollection;

        const collectedMetadatum = this.store.createRecord('collected-metadatum', {
            collection,
            creator: this.currentUser.user,
        });

        return {
            provider,
            collection,
            collectedMetadatum,
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
