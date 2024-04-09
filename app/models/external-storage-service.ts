import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export enum CredentialsFormat {
    OAUTH = 'oauth',
    OAUTH2 = 'oauth2',
    URL_USERNAME_PASSWORD = 'url_username_password',
    USERNAME_PASSWORD = 'username_password',
    REPO_TOKEN = 'repo_token',
    ACCESS_SECRET_KEYS = 'access_secret_keys',
}

export enum TermsOfServiceCapabilities {
    ADD_UPDATE_FILES = 'add_update_files',
    ADD_UPDATE_FILES_PARTIAL = 'add_update_files_partial',
    DELETE_FILES = 'delete_files',
    DELETE_FILES_PARTIAL = 'delete_files_partial',
    FORKING = 'forking',
    FORKING_PARTIAL = 'forking_partial',
    LOGS = 'logs',
    LOGS_PARTIAL = 'logs_partial',
    PERMISSIONS = 'permissions',
    PERMISSIONS_PARTIAL = 'permissions_partial',
    REGISTERING = 'registering',
    REGISTERING_PARTIAL = 'registering_partial',
    FILE_VERSIONS = 'file_versions',
}

export default class ExternalStorageServiceModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('string') credentialsFormat!: CredentialsFormat;
    @attr('string') iconUrl!: string;
    @attr('fixstringarray') termsOfService!: TermsOfServiceCapabilities[];
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
