import DS from 'ember-data';

import OsfModel from './osf-model';

const { attr } = DS;

export enum StorageStatus {
    DEFAULT = 'default',
    APPROACHING_PRIVATE = 'approachingPrivate',
    OVER_PRIVATE = 'overPrivate',
    APPROACHING_PUBLIC = 'approachingPublic',
    OVER_PUBLIC = 'overPublic',
}

export default class NodeStorageModel extends OsfModel {
    @attr('string') storageLimitStatus!: StorageStatus;
    @attr('string') storageUsage!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-storage': NodeStorageModel;
    } // eslint-disable-line semi
}
