import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import CollectionSubmission from 'ember-osf-web/models/collection-submission';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Node from 'ember-osf-web/models/node';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import isHybridGuid from 'ember-osf-web/utils/is-hybrid-guid';

interface TaskInstanceResult {
    provider: CollectionProvider;
    collection: Collection;
    collectionSubmission: CollectionSubmission;
    collectionItem: Node;
}

interface Params {
    guid: string;
}

export default class Guid extends Route {
    @service currentUser!: CurrentUser;
    @service store!: Store;
    @service theme!: Theme;

    @task
    @waitFor
    async loadModel(guid: string) {
        const provider = this.theme.provider as CollectionProvider;

        let collection: Collection;
        let cgmId: string;
        let collectedItemId: string;

        if (isHybridGuid(guid)) {
            cgmId = guid;
            const [collectionId, itemGuid] = cgmId.split('-');
            collectedItemId = itemGuid;
            collection = await this.store.findRecord('collection', collectionId);
        } else {
            collectedItemId = guid;
            collection = await provider.primaryCollection;
            cgmId = `${guid}-${collection.id}`;
        }

        try {
            const collectionSubmission = await this.store.findRecord('collection-submission', cgmId);
            const collectionItem = this.store.peekRecord('node', collectedItemId)!;

            if (!collectionItem.userHasAdminPermission) {
                this.intermediateTransitionTo(this.theme.prefixRoute('forbidden'));
                return undefined;
            }

            collectionItem.set('collectable', true);

            await collectionItem.license;

            return {
                provider,
                collection,
                collectionSubmission,
                collectionItem,
            } as TaskInstanceResult;
        } catch (e) {
            this.intermediateTransitionTo(this.theme.prefixRoute('page-not-found'));
            return undefined;
        }
    }

    model() {
        const { guid } = this.paramsFor(this.routeName) as Params;

        if (!/^[a-z0-9]{5}(-[a-z0-9]{5})?$/.test(guid)) {
            this.transitionTo(this.theme.prefixRoute('page-not-found'));
            return undefined;
        }

        return {
            taskInstance: taskFor(this.loadModel).perform(guid),
            guid,
        };
    }

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                itemGuid: this.controller.model.guid,
            },
        };
    }
}
