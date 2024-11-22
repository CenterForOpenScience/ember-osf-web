import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import UserReferenceModel from 'ember-osf-web/models/user-reference';
import ConfiguredAddonModel from 'ember-osf-web/models/configured-addon';
import AuthorizedAccountModel from 'ember-osf-web/models/authorized-account';

export enum ConnectedOperationNames {
    HasRevisions = 'has_revisions',
    ListRootItems = 'list_root_items',
    ListChildItems = 'list_child_items',
    GetItemInfo = 'get_item_info',
}

export interface OperationKwargs {
    itemId?: string;
    itemType?: ItemType;
    pageCursor?: string;
}

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

export type OperationResult = ListItemsResult | Item;

export interface ListItemsResult {
    items: Item[];
    thisSampleCursor?: string;
    nextSampleCursor?: string;
    prevSampleCursor?: string;
    firstSampleCursor?: string;
    totalCount?: number;
}

export interface Item {
    itemId: string;
    itemName: string;
    itemType: ItemType;
    canBeRoot: boolean;
    mayContainRootCandidates: boolean;
    itemPath?: Item[];
}

export default class AddonOperationInvocationModel extends Model {
    @attr('string') invocationStatus!: InvocationStatus;
    @attr('string') operationName!: ConnectedOperationNames;
    @attr('object', {snakifyForApi: true}) operationKwargs!: Partial<OperationKwargs>;
    @attr('object', {snakifyForApi: true}) operationResult!: OperationResult;
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
