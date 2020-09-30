import DS from 'ember-data';

import OsfModel from './osf-model';

const { attr } = DS;

export enum StorageStatus {
    DEFAULT = 'DEFAULT',
    APPROACHING_PRIVATE = 'APPROACHING_PRIVATE',
    OVER_PRIVATE = 'OVER_PRIVATE',
    APPROACHING_PUBLIC = 'APPROACHING_PUBLIC',
    OVER_PUBLIC = 'OVER_PUBLIC',
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
