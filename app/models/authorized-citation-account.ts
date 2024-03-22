import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ExternalCitationServiceModel from './external-citation-service';
import { AddonCredentialFields, AuthorizedAccountLinks } from './authorized-storage-account';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';

export default class AuthorizedCitationAccountModel extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];
    @attr('object') links!: AuthorizedAccountLinks;
    @attr('object') credentials?: AddonCredentialFields; // write-only
    @attr('boolean') readonly isAuthorized!: boolean;

    @belongsTo('external-citation-service')
    citationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;

    @belongsTo('user-reference', { inverse: 'authorizedCitationAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-citation-account': AuthorizedCitationAccountModel;
    } // eslint-disable-line semi
}
