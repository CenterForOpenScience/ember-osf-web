import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AuthorizedCloudComputingAccount from './authorized-cloud-computing-account';
import CloudComputingService from './cloud-computing-service';
import OsfModel from './osf-model';
import ResourceReferenceModel from './resource-reference';
import UserReferenceModel from './user-reference';

export default class ConfiguredCloudComputingAddonModel extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;

    @belongsTo('cloud-computing-service', { inverse: null })
    cloudComputingService!: AsyncBelongsTo<CloudComputingService> & CloudComputingService;

    @belongsTo('user-reference', { inverse: null })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('resource-reference', { inverse: 'configuredCloudComputingAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    @belongsTo('authorized-cloud-computing-account')
    baseAccount!: AsyncBelongsTo<AuthorizedCloudComputingAccount> & AuthorizedCloudComputingAccount;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-cloud-computing-addon': ConfiguredCloudComputingAddonModel;
    } // eslint-disable-line semi
}
