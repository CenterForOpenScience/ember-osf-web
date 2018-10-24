import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import { DS } from 'ember-data';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';

interface TaskInstanceResult {
    provider: CollectionProvider;
    collection: Collection;
    collectedMetadatum: CollectedMetadatum;
}

@requireAuth()
export default class Submit extends Route {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service theme!: Theme;

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
}
