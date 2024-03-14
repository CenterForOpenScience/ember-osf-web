import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AuthorizedCitationAccountModel from './authorized-citation-account';
import ExternalCitationServiceModel from './external-citation-service';
import OsfModel from './osf-model';
import ResourceReferenceModel from './resource-reference';
import UserReferenceModel from './user-reference';

export default class ConfiguredCitationAddonModel extends OsfModel {
    @attr('string') name!: string;
    @attr('string') displayName!: string;
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;

    @belongsTo('external-citation-service', { inverse: null })
    externalCitationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;

    @belongsTo('user-reference', { inverse: null })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('resource-reference', { inverse: 'configuredCitationAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    @belongsTo('authorized-citation-account')
    baseAccount!: AsyncBelongsTo<AuthorizedCitationAccountModel> & AuthorizedCitationAccountModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-citation-addon': ConfiguredCitationAddonModel;
    } // eslint-disable-line semi
}
