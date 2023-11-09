import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class StorageAddonProviderModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('fixstring') iconUri!: string;
    @attr('fixstring') authUri!: string;
    @attr('boolean') readOnly!: boolean;
    @attr('boolean') supportsCopy!: boolean;
    @attr('boolean') supportsUserSpecifiedRootFolder!: boolean;
    @attr('boolean') supportsFileVersioning!: boolean;
    @attr('boolean') supportsBulkDownload!: boolean;
    @attr('number') maxConcurrentDownloads!: number;
    @attr('number') maxUploadMb!: number;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'storage-addon-provider': StorageAddonProviderModel;
    } // eslint-disable-line semi
}
