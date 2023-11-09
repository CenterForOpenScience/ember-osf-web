import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import OsfUserModel from 'ember-osf-web/models/osf-user';

import OsfModel from './osf-model';

export default class AuthorizedStorageAccountModel extends OsfModel {
    @attr('fixstring') storageProvider!: string;
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];
    @attr('fixstring') defaultRootFolder!: string;

    @belongsTo('osf-user', { inverse: null })
    configuringUser!: AsyncBelongsTo<OsfUserModel> & OsfUserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-storage-account': AuthorizedStorageAccountModel;
    } // eslint-disable-line semi
}
