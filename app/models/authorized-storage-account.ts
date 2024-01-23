import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ExternalStorageServiceModel from './external-storage-service';
import InternalUserModel from './internal-user';
import OsfModel from './osf-model';

export default class AuthorizedStorageAccountModel extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];

    @belongsTo('external-storage-service')
    storageProvider!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @belongsTo('internal-user', { inverse: 'authorizedStorageAccounts' })
    configuringUser!: AsyncBelongsTo<InternalUserModel> & InternalUserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-storage-account': AuthorizedStorageAccountModel;
    } // eslint-disable-line semi
}
