import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ExternalCitationServiceModel from './external-citation-service';
import { AddonCredentialFields } from './authorized-storage-account';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';

export default class AuthorizedCitationAccountModel extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];
    @attr('object') credentials?: AddonCredentialFields; // write-only
    @attr('fixstring') readonly authUrl!: string; // Only returned when POSTing to /authorized-citation-accounts
    @attr('boolean') readonly credentialsAvailable!: boolean;

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
