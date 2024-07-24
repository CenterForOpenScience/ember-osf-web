import Model, { attr } from '@ember-data/model';

export enum CredentialsFormat {
    OAUTH = 'OAUTH1',
    OAUTH2 = 'OAUTH2',
    USERNAME_PASSWORD = 'USERNAME_PASSWORD',
    ACCESS_SECRET_KEYS = 'ACCESS_KEY_SECRET_KEY',
    REPO_TOKEN = 'PERSONAL_ACCESS_TOKEN',
    URL_USERNAME_PASSWORD = 'url_username_password',
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
    @attr('boolean') configurableApiRoot!: boolean;
}
