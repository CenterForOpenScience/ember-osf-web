import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ExternalComputingService from './external-computing-service';
import { AddonCredentialFields, AuthorizedAccountLinks } from './authorized-storage-account';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';

export default class AuthorizedComputingAccount extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];
    @attr('object') links!: AuthorizedAccountLinks;
    @attr('object') credentials?: AddonCredentialFields; // write-only
    @attr('boolean') readonly isAuthorized!: boolean;

    @belongsTo('external-computing-service')
    computingService!: AsyncBelongsTo<ExternalComputingService> & ExternalComputingService;

    @belongsTo('user-reference', { inverse: 'authorizedComputingAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-computing-account': AuthorizedComputingAccount;
    } // eslint-disable-line semi
}
