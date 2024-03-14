import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ExternalComputingService from './external-computing-service';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';

export default class AuthorizedComputingAccount extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];

    @belongsTo('external-computing-service')
    externalComputingService!: AsyncBelongsTo<ExternalComputingService> & ExternalComputingService;

    @belongsTo('user-reference', { inverse: 'authorizedComputingAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-computing-account': AuthorizedComputingAccount;
    } // eslint-disable-line semi
}
