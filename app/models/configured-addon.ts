import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ResourceReferenceModel from './resource-reference';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';

export default class ConfiguredAddonModel extends OsfModel {
    @attr('string') name!: string;
    @attr('string') displayName!: string;
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;

    @attr('string') iconUrl!: string;
    @attr('string') authorizedResourceUri!: string;


    @belongsTo('user-reference', { inverse: null })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('resource-reference', { inverse: 'configuredStorageAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;
}
