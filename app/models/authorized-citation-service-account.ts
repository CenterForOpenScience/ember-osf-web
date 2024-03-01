import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import CitationServiceModel from './citation-service';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';

export default class AuthorizedCitationServiceAccountModel extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];

    @belongsTo('citation-service')
    citationService!: AsyncBelongsTo<CitationServiceModel> & CitationServiceModel;

    @belongsTo('user-reference', { inverse: 'authorizedCitationServiceAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-citation-service-account': AuthorizedCitationServiceAccountModel;
    } // eslint-disable-line semi
}
