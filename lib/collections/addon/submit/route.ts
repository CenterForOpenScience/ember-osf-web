import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import { DS } from 'ember-data';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';

@requireAuth()
export default class Submit extends Route {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service theme!: Theme;

    loadModel = task(function *(this: Submit): IterableIterator<any> {
        const provider = this.theme.provider as CollectionProvider;
        const primaryCollection = yield provider.primaryCollection;

        const collectedMetadatum = this.store.createRecord('collected-metadatum', {
            collection: primaryCollection,
            creator: this.currentUser.user,
        });

        return {
            provider,
            primaryCollection,
            collectedMetadatum,
        };
    });

    model(this: Submit): any {
        return {
            taskInstance: this.get('loadModel').perform(),
        };
    }
}
