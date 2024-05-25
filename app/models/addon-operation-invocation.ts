import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import UserReferenceModel from 'ember-osf-web/models/user-reference';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';
import { ConnectedOperationNames } from 'ember-osf-web/models/configured-storage-addon';

export enum InvocationStatus {
     // TODO: are these right?
    Success = 'SUCCESS',
    Failure = 'FAILURE',
    Pending = 'PENDING',
}
export enum ItemType {
    Folder = 'FOLDER',
    File = 'FILE',
}

export type OperationName = 'get_root_items' | 'get_child_items';
export interface OperationResult{
    items: Item[];
    cursor?: string; // TODO: name??
}
export interface Item {
    itemId: string;
    itemName: string;
    itemType: ItemType;
    itemPath?: string;
}

export default class AddonOperationInvocationModel extends Model {
    @attr('string') invocationStatus!: InvocationStatus;
    @attr('string') operationName!: ConnectedOperationNames;
    @attr('object') operationKwargs!: any;
    @attr('object') operationResult!: OperationResult;
    @attr('date') created!: Date;
    @attr('date') modified!: Date;

    @belongsTo('user-reference', { inverse: null })
    byUser!: AsyncBelongsTo<UserReferenceModel> | UserReferenceModel;

    @belongsTo('configured-addon', { inverse: null, polymorphic: true })
    thruAddon?: AsyncBelongsTo<ConfiguredAddonModel> | ConfiguredAddonModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'addon-operation-invocation': AddonOperationInvocationModel;
    } // eslint-disable-line semi
}
