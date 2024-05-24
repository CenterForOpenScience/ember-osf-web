import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ResourceReferenceModel from './resource-reference';
import UserReferenceModel from './user-reference';

export default class ConfiguredAddonModel extends Model {
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

    async getFolderItems(this: ConfiguredAddonModel) {
        const data = await fetch('http://localhost:7979/v1/addon-operation-invocations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operationName: 'list_folder',
                thruAddon: this,
                byUser: this.accountOwner.id,
            }),
        });
        return data;
    }
}
