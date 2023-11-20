import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import InternalUserModel from './internal-user';
import OsfModel from './osf-model';

export default class AuthorizedStorageAccountModel extends OsfModel {
    @attr('fixstring') storageProvider!: string;
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];
    @attr('fixstring') defaultRootFolder!: string;

    @belongsTo('internal-user', { inverse: 'authorizedStorageAccounts' })
    configuringUser!: AsyncBelongsTo<InternalUserModel> & InternalUserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-storage-account': AuthorizedStorageAccountModel;
    } // eslint-disable-line semi
}
