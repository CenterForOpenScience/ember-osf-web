import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import AuthorizedCitationAccountModel from './authorized-citation-account';
import ExternalCitationServiceModel from './external-citation-service';
import ConfiguredAddonModel from './configured-addon';

export default class ConfiguredCitationAddonModel extends ConfiguredAddonModel {
    @belongsTo('external-citation-service', { inverse: null })
    externalCitationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;

    @belongsTo('authorized-citation-account')
    baseAccount!: AsyncBelongsTo<AuthorizedCitationAccountModel> & AuthorizedCitationAccountModel;

    get externalServiceId() {
        return (this as ConfiguredCitationAddonModel).belongsTo('externalCitationService').id();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-citation-addon': ConfiguredCitationAddonModel;
    } // eslint-disable-line semi
}
