import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ExternalCitationServiceModel from './external-citation-service';
import AuthorizedAccountModel from './authorized-account';
import UserReferenceModel from './user-reference';

export default class AuthorizedCitationAccountModel extends AuthorizedAccountModel {
    @belongsTo('user-reference', { inverse: 'authorizedCitationAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('external-citation-service')
    citationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-citation-account': AuthorizedCitationAccountModel;
    } // eslint-disable-line semi
}