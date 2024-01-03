import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ExternalAccountsModel from 'ember-osf-web/models/external-account';
import NodeModel from 'ember-osf-web/models/node';

import OsfModel from './osf-model';

export default class NodeAddonModel extends OsfModel {
    @attr('boolean') nodeHasAuth!: boolean;
    @attr('boolean') configured!: boolean;
    @attr('string') folderId?: string;
    @attr('string') folderPath?: string;

    @belongsTo('node', { inverse: 'nodeAddons' })
    node!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('external-account', { inverse: null })
    externalAccount!: AsyncBelongsTo<ExternalAccountsModel> & ExternalAccountsModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-addon': NodeAddonModel;
    } // eslint-disable-line semi
}
