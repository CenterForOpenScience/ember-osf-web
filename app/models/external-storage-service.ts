import { attr } from '@ember-data/model';

import ExternalServiceModel from './external-service';

export default class ExternalStorageServiceModel extends ExternalServiceModel {
    @attr('boolean') configurableApiRoot!: boolean;
    @attr('number') maxConcurrentDownloads!: number;
    @attr('number') maxUploadMb!: number;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-storage-service': ExternalStorageServiceModel;
    } // eslint-disable-line semi
}
