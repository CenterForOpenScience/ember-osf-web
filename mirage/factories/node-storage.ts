import { Factory, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import NodeStorageModel, { StorageStatuses } from 'ember-osf-web/models/node-storage';

export interface NodeStorageTraits {
    approachingPrivate: Trait;
    overPrivate: Trait;
}

export default Factory.extend<NodeStorageModel & NodeStorageTraits>({
    storageLimitStatus() {
        return faker.random.number({ min: 10, max: 100 });
    },
    storageUsage() {
        return faker.random.number({ min: 10, max: 100 });
    },
    approachingPrivate: trait<NodeStorageModel>({
        afterCreate(nodeStorage) {
            nodeStorage.set('storageLimitStatus', StorageStatuses.APPROACHING_PRIVATE);
        },
    }),
    overPrivate: trait<NodeStorageModel>({
        afterCreate(nodeStorage) {
            nodeStorage.set('storageLimitStatus', StorageStatuses.OVER_PRIVATE);
        },
    }),
    // TODO: Add traits for all of the storage statuses? or is there a better way?
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        nodeStorage: NodeStorageModel;
    } // eslint-disable-line semi
}
