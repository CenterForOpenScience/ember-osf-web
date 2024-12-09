import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import AuthorizedCitationAccountModel from './authorized-citation-account';
import ExternalCitationServiceModel from './external-citation-service';
import ConfiguredAddonModel from './configured-addon';

export default class ConfiguredCitationAddonModel extends ConfiguredAddonModel {
    @belongsTo('external-citation-service', { inverse: null })
    externalCitationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;

    @belongsTo('authorized-citation-account')
    baseAccount!: AsyncBelongsTo<AuthorizedCitationAccountModel> & AuthorizedCitationAccountModel;

    @belongsTo('resource-reference', { inverse: 'configuredCitationAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    get externalServiceId() {
        return (this as ConfiguredCitationAddonModel).belongsTo('externalCitationService').id();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-citation-addon': ConfiguredCitationAddonModel;
    } // eslint-disable-line semi
}
