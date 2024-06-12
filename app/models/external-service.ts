import Model, { attr } from '@ember-data/model';

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

export default class ExternalServiceModel extends Model {
    @attr('fixstring') displayName!: string;
    @attr('string') iconUrl!: string;
    @attr('string') credentialsFormat!: CredentialsFormat;
    @attr('array') termsOfService!: TermsOfServiceCapabilities[];
}
