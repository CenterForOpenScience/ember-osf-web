import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import ConfiguredAddonModel from './configured-addon';
import ExternalStorageServiceModel from './external-storage-service';


export default class ConfiguredStorageAddonModel extends ConfiguredAddonModel {
    @attr('number') concurrentUploads!: number;

    @belongsTo('external-storage-service', { inverse: null })
    externalStorageService!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @belongsTo('authorized-storage-account')
    baseAccount!: AsyncBelongsTo<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel;

    get externalServiceId() {
        return (this as ConfiguredStorageAddonModel).belongsTo('externalStorageService').id();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
