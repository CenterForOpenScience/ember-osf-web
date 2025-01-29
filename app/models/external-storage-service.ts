import { attr } from '@ember-data/model';

import ExternalServiceModel from './external-service';

export default class ExternalStorageServiceModel extends ExternalServiceModel {
    @attr('number') maxConcurrentDownloads!: number;
    @attr('number') maxUploadMb!: number;
    @attr('string') wbKey!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-storage-service': ExternalStorageServiceModel;
    } // eslint-disable-line semi
}
