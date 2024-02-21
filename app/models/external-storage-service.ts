import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export enum CredentialsFormat {
    OAUTH = 'oauth',
    OAUTH2 = 'oauth2',
    USERNAME_PASSWORD = 'username_password',
    REPO_TOKEN = 'repo_token',
    SECRET_KEY = 'secret_key',
}

export default class ExternalStorageServiceModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('fixstring') iconUri!: string;
    @attr('fixstring') authUri!: string;
    @attr('string') credentialsFormat!: CredentialsFormat;
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
