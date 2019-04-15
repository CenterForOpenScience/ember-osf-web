import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import { DS } from 'ember-data';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Node from 'ember-osf-web/models/node';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import isHybridGuid from 'ember-osf-web/utils/is-hybrid-guid';

interface TaskInstanceResult {
    provider: CollectionProvider;
    collection: Collection;
    collectedMetadatum: CollectedMetadatum;
    collectionItem: Node;
}

interface Params {
    guid: string;
}

export default class Guid extends Route {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service theme!: Theme;

    loadModel = task(function *(this: Guid, guid: string): IterableIterator<any> {
        const provider = this.theme.provider as CollectionProvider;

        let collection: Collection;
        let cgmId: string;
        let collectedItemId: string;

        if (isHybridGuid(guid)) {
            cgmId = guid;
            const [collectionId, itemGuid] = cgmId.split('-');
            collectedItemId = itemGuid;
            collection = yield this.store.findRecord('collection', collectionId);
        } else {
            collectedItemId = guid;
            collection = yield provider.primaryCollection;
            cgmId = `${collection.id}-${guid}`;
        }

        try {
            const collectedMetadatum: CollectedMetadatum = yield this.store.findRecord('collected-metadatum', cgmId);
            const collectionItem = this.store.peekRecord('node', collectedItemId)!;

            if (!collectionItem.userHasAdminPermission) {
                this.intermediateTransitionTo(this.theme.prefixRoute('forbidden'));
                return undefined;
            }

            collectionItem.set('collectable', true);

            yield collectionItem.license;

            return {
                provider,
                collection,
                collectedMetadatum,
                collectionItem,
            } as TaskInstanceResult;
        } catch (e) {
            this.intermediateTransitionTo(this.theme.prefixRoute('page-not-found'));
            return undefined;
        }
    });

    model(this: Guid) {
        const { guid } = this.paramsFor(this.routeName) as Params;

        if (!/^[a-z0-9]{5}(-[a-z0-9]{5})?$/.test(guid)) {
            this.transitionTo(this.theme.prefixRoute('page-not-found'));
            return undefined;
        }

        return {
            taskInstance: this.get('loadModel').perform(guid) as Promise<TaskInstanceResult>,
        };
    }
}
