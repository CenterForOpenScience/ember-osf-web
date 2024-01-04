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

    get externalUserId() {
        return this.externalAccount?.get('user').get('id');
    }

    get externalUserDisplayName() {
        return this.externalAccount?.get('displayName');
    }

    get rootFolder() {
        return this.folderId || this.folderPath;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-addon': NodeAddonModel;
    } // eslint-disable-line semi
}
