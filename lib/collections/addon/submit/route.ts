import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import { DS } from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
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
export default class Submit extends Route.extend(ConfirmationMixin, {}) {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service theme!: Theme;
    @service i18n!: I18N;

    // This tells ember-onbeforeunload what to use as the body for the warning before leaving the page.
    confirmationMessage = this.i18n.t('collections.collections_submission.warning_body');

    loadModel = task(function *(this: Submit): IterableIterator<any> {
        const provider = this.theme.provider as CollectionProvider;
        const collection = yield provider.primaryCollection;

        const collectedMetadatum = this.store.createRecord('collected-metadatum', {
            collection,
            creator: this.currentUser.user,
        });

        return {
            provider,
            collection,
            collectedMetadatum,
        } as TaskInstanceResult;
    });

    model(this: Submit) {
        return {
            taskInstance: this.get('loadModel').perform() as Promise<TaskInstanceResult>,
        };
    }

    // This tells ember-onbeforeunload's ConfirmationMixin whether or not to stop transitions
    @computed('controller.isPageDirty')
    get isPageDirty() {
        const controller = this.controller as SubmissionController;
        return () => controller.isPageDirty;
    }
}
