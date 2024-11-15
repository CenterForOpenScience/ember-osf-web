import Model, { attr } from '@ember-data/model';

export enum CredentialsFormat {
    OAUTH = 'OAUTH1A',
    OAUTH2 = 'OAUTH2',
    USERNAME_PASSWORD = 'USERNAME_PASSWORD',
    ACCESS_SECRET_KEYS = 'ACCESS_KEY_SECRET_KEY',
    REPO_TOKEN = 'PERSONAL_ACCESS_TOKEN',
    DATAVERSE_API_TOKEN = 'DATAVERSE_API_TOKEN',
    URL_USERNAME_PASSWORD = 'url_username_password',
}

export enum ExternalServiceCapabilities {
    ADD_UPDATE_FILES = 'ADD_UPDATE_FILES',
    ADD_UPDATE_FILES_PARTIAL = 'ADD_UPDATE_FILES_PARTIAL',
    DELETE_FILES = 'DELETE_FILES',
    DELETE_FILES_PARTIAL = 'DELETE_FILES_PARTIAL',
    FORKING = 'FORKING',
    FORKING_PARTIAL = 'FORKING_PARTIAL',
    LOGS = 'LOGS',
    LOGS_PARTIAL = 'LOGS_PARTIAL',
    PERMISSIONS = 'PERMISSIONS',
    PERMISSIONS_PARTIAL = 'PERMISSIONS_PARTIAL',
    REGISTERING = 'REGISTERING',
    REGISTERING_PARTIAL = 'REGISTERING_PARTIAL',
    FILE_VERSIONS = 'FILE_VERSIONS',
    DOWNLOAD_AS_ZIP = 'DOWNLOAD_AS_ZIP',
    COPY_INTO = 'COPY_INTO',
}

export default class ExternalServiceModel extends Model {
    @attr('fixstring') displayName!: string;
    @attr('string') iconUrl!: string;
    @attr('string') credentialsFormat!: CredentialsFormat;
    @attr('array') supportedFeatures!: ExternalServiceCapabilities[];
    @attr('boolean') configurableApiRoot!: boolean;
}
