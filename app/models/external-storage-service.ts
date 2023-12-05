import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class ExternalStorageServiceModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('fixstring') iconUri!: string;
    @attr('fixstring') authUri!: string;
    // TODO: combine these boolean scopes into a single array of strings from some enum
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
        'external-storage-service': ExternalStorageServiceModel;
    } // eslint-disable-line semi
}
