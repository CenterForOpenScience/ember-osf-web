import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import { ConnectedCapabilities } from 'ember-osf-web/models/configured-storage-addon';
import AuthorizedCitationAccountModel from './authorized-citation-account';
import ExternalCitationServiceModel from './external-citation-service';
import ConfiguredAddonModel from './configured-addon';

export default class ConfiguredCitationAddonModel extends ConfiguredAddonModel {
    @belongsTo('external-citation-service', { inverse: null })
    externalCitationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;

    @belongsTo('authorized-citation-account')
    baseAccount!: AsyncBelongsTo<AuthorizedCitationAccountModel> & AuthorizedCitationAccountModel;

    @attr('array') connectedCapabilities!: ConnectedCapabilities[];

    get externalServiceId() {
        return (this as ConfiguredCitationAddonModel).belongsTo('externalCitationService').id();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-citation-addon': ConfiguredCitationAddonModel;
    } // eslint-disable-line semi
}
