import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ExternalCitationServiceModel from './external-citation-service';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';

export default class AuthorizedCitationAccountModel extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];

    @belongsTo('external-citation-service')
    externalCitationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;

    @belongsTo('user-reference', { inverse: 'authorizedCitationAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-citation-account': AuthorizedCitationAccountModel;
    } // eslint-disable-line semi
}
