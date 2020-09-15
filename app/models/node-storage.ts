import DS from 'ember-data';

import NodeModel from './node';
import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

export enum StorageStatuses {
    DEFAULT = 'default',
    APPROACHING_PRIVATE = 'approachingPrivate',
    OVER_PRIVATE = 'overPrivate',
    APPROACHING_PUBLIC = 'approachingPublic',
    OVER_PUBLIC = 'overPublic',
}

export default class NodeStorageModel extends OsfModel {
    @attr('fixstring') storageLimitStatus!: string;
    @attr('number') storageUsage!: number;

    @belongsTo('node', { inverse: 'storage' })
    node!: DS.PromiseObject<NodeModel> & NodeModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-storage': NodeStorageModel;
    } // eslint-disable-line semi
}
