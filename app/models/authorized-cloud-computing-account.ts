import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import CloudComputingService from './cloud-computing-service';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';

export default class AuthorizedCloudComputingAccount extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];

    @belongsTo('cloud-computing-service')
    cloudComputingService!: AsyncBelongsTo<CloudComputingService> & CloudComputingService;

    @belongsTo('user-reference', { inverse: 'authorizedCloudComputingAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-cloud-computing-account': AuthorizedCloudComputingAccount;
    } // eslint-disable-line semi
}
