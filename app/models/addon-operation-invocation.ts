import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import UserReferenceModel from 'ember-osf-web/models/user-reference';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';
import AuthorizedAccountModel from 'ember-osf-web/models/authorized-account';
import { ConnectedOperationNames } from 'ember-osf-web/models/configured-storage-addon';

export enum InvocationStatus {
    STARTING = 'STARTING',
    GOING = 'GOING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}
export enum ItemType {
    Folder = 'FOLDER',
    File = 'FILE',
}

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

    @belongsTo('authorized-account', { inverse: null, polymorphic: true })
    thruAccount?: AsyncBelongsTo<AuthorizedAccountModel> | AuthorizedAccountModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'addon-operation-invocation': AddonOperationInvocationModel;
    } // eslint-disable-line semi
}
