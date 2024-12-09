import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import ConfiguredAddonModel from './configured-addon';
import ExternalStorageServiceModel from './external-storage-service';


export default class ConfiguredStorageAddonModel extends ConfiguredAddonModel {
    @attr('number') concurrentUploads!: number;

    @belongsTo('external-storage-service', { inverse: null })
    externalStorageService!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @belongsTo('authorized-storage-account')
    baseAccount!: AsyncBelongsTo<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel;

    @belongsTo('resource-reference', { inverse: 'configuredStorageAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    get externalServiceId() {
        return (this as ConfiguredStorageAddonModel).belongsTo('externalStorageService').id();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
