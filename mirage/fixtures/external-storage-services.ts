import { CredentialsFormat, TermsOfServiceCapabilities } from 'ember-osf-web/models/external-storage-service';
export default [
    {
        id: 'box',
        name: 'Box',
        credentialsFormat: CredentialsFormat.OAUTH2,
        termsOfService: [
            TermsOfServiceCapabilities.ADD_UPDATE_FILES,
            TermsOfServiceCapabilities.DELETE_FILES,
            TermsOfServiceCapabilities.FORKING,
            TermsOfServiceCapabilities.LOGS,
            TermsOfServiceCapabilities.PERMISSIONS,
            TermsOfServiceCapabilities.REGISTERING,
            TermsOfServiceCapabilities.FILE_VERSIONS,
        ],
        configurableApiRoot: false,
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: true,
        supportsFileVersioning: false,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 1,
        maxUploadMb: 5,
        iconUrl: 'https://www.box.com/favicon.ico',
    },
    {
        id: 'bitbucket',
        name: 'Bitbucket',
        credentialsFormat: CredentialsFormat.OAUTH2,
        termsOfService: [
            TermsOfServiceCapabilities.FORKING,
            TermsOfServiceCapabilities.PERMISSIONS,
            TermsOfServiceCapabilities.REGISTERING,
            TermsOfServiceCapabilities.FILE_VERSIONS,
            TermsOfServiceCapabilities.LOGS,
        ],
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: true,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 1,
        maxUploadMb: 5,
        iconUrl: 'https://bitbucket.org/favicon.ico',
    },
    {
        id: 'dataverse',
        name: 'Dataverse',
        credentialsFormat: CredentialsFormat.REPO_TOKEN,
        termsOfService: [
            TermsOfServiceCapabilities.ADD_UPDATE_FILES,
            TermsOfServiceCapabilities.DELETE_FILES,
            TermsOfServiceCapabilities.FORKING,
            TermsOfServiceCapabilities.LOGS,
            TermsOfServiceCapabilities.PERMISSIONS,
            TermsOfServiceCapabilities.REGISTERING,
        ],
        configurableApiRoot: true,
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: true,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 1,
        maxUploadMb: 5,
        iconUrl: 'https://dataverse.org/favicon.ico',
    },
    {
        id: 'dropbox',
        name: 'Dropbox',
        credentialsFormat: CredentialsFormat.OAUTH2,
        termsOfService: [
            TermsOfServiceCapabilities.ADD_UPDATE_FILES,
            TermsOfServiceCapabilities.DELETE_FILES,
            TermsOfServiceCapabilities.FORKING,
            TermsOfServiceCapabilities.LOGS,
            TermsOfServiceCapabilities.PERMISSIONS,
            TermsOfServiceCapabilities.REGISTERING,
            TermsOfServiceCapabilities.FILE_VERSIONS,
        ],
        configurableApiRoot: false,
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: true,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 1,
        maxUploadMb: 5,
        iconUrl: 'https://www.dropbox.com/favicon.ico',
    },
    {
        id: 'figshare',
        name: 'figshare',
        credentialsFormat: CredentialsFormat.OAUTH2,
        termsOfService: [
            TermsOfServiceCapabilities.ADD_UPDATE_FILES_PARTIAL,
            TermsOfServiceCapabilities.DELETE_FILES_PARTIAL,
            TermsOfServiceCapabilities.FORKING,
            TermsOfServiceCapabilities.LOGS,
            TermsOfServiceCapabilities.PERMISSIONS,
            TermsOfServiceCapabilities.REGISTERING,
        ],
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: true,
        supportsFileVersioning: false,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 1,
        maxUploadMb: 5,
        // eslint-disable-next-line max-len
        iconUrl: 'https://websitev3-p-eu.figstatic.com/assets-v3/fcfec9336d388a460d29d529c9992922a5ee9a2f/static/media/favicon-144.0533ef52.png',
    },
    {
        id: 'gitlab',
        name: 'GitLab',
        credentialsFormat: CredentialsFormat.REPO_TOKEN,
        termsOfService: [
            TermsOfServiceCapabilities.FORKING,
            TermsOfServiceCapabilities.PERMISSIONS,
            TermsOfServiceCapabilities.REGISTERING,
            TermsOfServiceCapabilities.FILE_VERSIONS,
        ],
        configurableApiRoot: true,
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: true,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 1,
        maxUploadMb: 5,
        iconUrl: 'https://gitlab.com/favicon.ico',
    },
    {
        id: 'onedrive',
        name: 'OneDrive',
        credentialsFormat: CredentialsFormat.OAUTH2,
        termsOfService: [
            TermsOfServiceCapabilities.ADD_UPDATE_FILES,
            TermsOfServiceCapabilities.DELETE_FILES,
            TermsOfServiceCapabilities.FORKING,
            TermsOfServiceCapabilities.LOGS,
            TermsOfServiceCapabilities.PERMISSIONS,
            TermsOfServiceCapabilities.REGISTERING,
            TermsOfServiceCapabilities.FILE_VERSIONS,
        ],
        configurableApiRoot: false,
        readOnly: true,
        supportsCopy: false,
        supportsUserSpecificRootFolder: true,
        supportsFileVersioning: false,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 1,
        maxUploadMb: 5,
        icon: 'https://onedrive.live.com/favicon.ico',
    },
    {
        id: 'owncloud',
        name: 'ownCloud',
        credentialsFormat: CredentialsFormat.URL_USERNAME_PASSWORD,
        termsOfService: [
            TermsOfServiceCapabilities.ADD_UPDATE_FILES,
            TermsOfServiceCapabilities.DELETE_FILES,
            TermsOfServiceCapabilities.FORKING,
            TermsOfServiceCapabilities.LOGS,
            TermsOfServiceCapabilities.PERMISSIONS,
            TermsOfServiceCapabilities.REGISTERING,
        ],
        configurableApiRoot: true,
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: true,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 1,
        maxUploadMb: 5,
        iconUrl: 'https://owncloud.com/favicon.ico',
    },
    {
        id: 's3',
        name: 'Amazon S3',
        credentialsFormat: CredentialsFormat.ACCESS_SECRET_KEYS,
        termsOfService: [
            TermsOfServiceCapabilities.ADD_UPDATE_FILES,
            TermsOfServiceCapabilities.DELETE_FILES,
            TermsOfServiceCapabilities.FORKING,
            TermsOfServiceCapabilities.LOGS,
            TermsOfServiceCapabilities.PERMISSIONS,
            TermsOfServiceCapabilities.REGISTERING,
        ],
        configurableApiRoot: false,
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: true,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 1,
        maxUploadMb: 5,
        iconUrl: 'https://aws.amazon.com/favicon.ico',
    },
];
