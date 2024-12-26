import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import AuthorizedComputingAccountModel from './authorized-computing-account';
import ExternalComputingServiceModel from './external-computing-service';
import ConfiguredAddonModel from './configured-addon';

export default class ConfiguredComputingAddonModel extends ConfiguredAddonModel {
    @belongsTo('external-computing-service', { inverse: null })
    externalComputingService!: AsyncBelongsTo<ExternalComputingServiceModel> & ExternalComputingServiceModel;

    @belongsTo('authorized-computing-account')
    baseAccount!: AsyncBelongsTo<AuthorizedComputingAccountModel> & AuthorizedComputingAccountModel;

    @belongsTo('resource-reference', { inverse: 'configuredComputingAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    get externalServiceId() {
        return (this as ConfiguredComputingAddonModel).belongsTo('externalComputingService').id();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-computing-addon': ConfiguredComputingAddonModel;
    } // eslint-disable-line semi
}
