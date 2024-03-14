import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AuthorizedComputingAccount from './authorized-computing-account';
import ExternalComputingService from './external-computing-service';
import OsfModel from './osf-model';
import ResourceReferenceModel from './resource-reference';
import UserReferenceModel from './user-reference';

export default class ConfiguredComputingAddonModel extends OsfModel {
    @attr('string') name!: string;
    @attr('string') displayName!: string;
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;

    @belongsTo('external-computing-service', { inverse: null })
    externalComputingService!: AsyncBelongsTo<ExternalComputingService> & ExternalComputingService;

    @belongsTo('user-reference', { inverse: null })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('resource-reference', { inverse: 'configuredComputingAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    @belongsTo('authorized-computing-account')
    baseAccount!: AsyncBelongsTo<AuthorizedComputingAccount> & AuthorizedComputingAccount;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-computing-addon': ConfiguredComputingAddonModel;
    } // eslint-disable-line semi
}
