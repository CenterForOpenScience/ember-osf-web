import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AuthorizedCitationServiceAccountModel from './authorized-citation-service-account';
import CitationServiceModel from './citation-service';
import OsfModel from './osf-model';
import ResourceReferenceModel from './resource-reference';
import UserReferenceModel from './user-reference';

export default class ConfiguredCitationServiceAddonModel extends OsfModel {
    @attr('string') name!: string;
    @attr('string') displayName!: string;
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;

    @belongsTo('citation-service', { inverse: null })
    citationService!: AsyncBelongsTo<CitationServiceModel> & CitationServiceModel;

    @belongsTo('user-reference', { inverse: null })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('resource-reference', { inverse: 'configuredCitationServiceAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    @belongsTo('authorized-citation-service-account')
    baseAccount!: AsyncBelongsTo<AuthorizedCitationServiceAccountModel> & AuthorizedCitationServiceAccountModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-citation-service-addon': ConfiguredCitationServiceAddonModel;
    } // eslint-disable-line semi
}
