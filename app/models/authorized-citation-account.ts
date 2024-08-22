import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ExternalCitationServiceModel from './external-citation-service';
import AuthorizedAccountModel from './authorized-account';
import UserReferenceModel from './user-reference';

export default class AuthorizedCitationAccountModel extends AuthorizedAccountModel {
    @belongsTo('user-reference', { inverse: 'authorizedCitationAccounts' })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('external-citation-service')
    externalCitationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-citation-account': AuthorizedCitationAccountModel;
    } // eslint-disable-line semi
}
