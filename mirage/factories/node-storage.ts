import { Factory, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import NodeStorageModel, { StorageStatus } from 'ember-osf-web/models/node-storage';

export interface NodeStorageTraits {
    approachingPrivate: Trait;
    approachingPublic: Trait;
    overPrivate: Trait;
    overPublic: Trait;
}

export default Factory.extend<NodeStorageModel & NodeStorageTraits>({
    storageLimitStatus: StorageStatus.DEFAULT,
    storageUsage() {
        return `${faker.random.number({ min: 10, max: 100 })}`;
    },
    approachingPrivate: trait<NodeStorageModel>({
        afterCreate(nodeStorage) {
            nodeStorage.update('storageLimitStatus', StorageStatus.APPROACHING_PRIVATE);
        },
    }),
    approachingPublic: trait<NodeStorageModel>({
        afterCreate(nodeStorage) {
            nodeStorage.update('storageLimitStatus', StorageStatus.APPROACHING_PUBLIC);
        },
    }),
    overPrivate: trait<NodeStorageModel>({
        afterCreate(nodeStorage) {
            nodeStorage.update('storageLimitStatus', StorageStatus.OVER_PRIVATE);
        },
    }),
    overPublic: trait<NodeStorageModel>({
        afterCreate(nodeStorage) {
            nodeStorage.update('storageLimitStatus', StorageStatus.OVER_PUBLIC);
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        nodeStorage: NodeStorageModel;
    } // eslint-disable-line semi
}
