import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import ExternalStorageServiceModel from './external-storage-service';
import AuthorizedAccountModel from './authorized-account';

export default class AuthorizedStorageAccountModel extends AuthorizedAccountModel {
    @attr('fixstring') apiBaseUrl!: string; // Only applicable when ExternalStorageService.configurableApiRoot === true

    @belongsTo('external-storage-service')
    storageProvider!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-storage-account': AuthorizedStorageAccountModel;
    } // eslint-disable-line semi
}
