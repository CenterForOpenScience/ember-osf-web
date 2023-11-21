// TODO: needs iconUri and authUri
export default [
    {
        id: 'bitbucket',
        name: 'Bitbucket',
        readOnly: true,
        supportsCopy: false,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: false,
        supportsBulkDownload: false,
        maxConcurrentDownloads: 2,
        maxUploadMb: 0,
    },
    {
        id: 'box',
        name: 'Box',
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: false,
        supportsBulkDownload: false,
        maxConcurrentDownloads: 2,
        maxUploadMb: 5,
    },
    {
        id: 'dataverse',
        name: 'Dataverse',
        readOnly: true,
        supportsCopy: false,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: false,
        supportsBulkDownload: false,
        maxConcurrentDownloads: 2,
        maxUploadMb: 0,
    },
    {
        id: 'dropbox',
        name: 'Dropbox',
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 2,
        maxUploadMb: 5,
    },
    {
        id: 'github',
        name: 'GitHub',
        readOnly: false,
        supportsCopy: false,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: true,
        supportsBulkDownload: false,
        maxConcurrentDownloads: 2,
        maxUploadMb: 5,
    },
    {
        id: 'gitlab',
        name: 'GitLab',
        readOnly: true,
        supportsCopy: false,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: false,
        supportsBulkDownload: false,
        maxConcurrentDownloads: 2,
        maxUploadMb: 0,
    },
    {
        id: 'googledrive',
        name: 'Google Drive',
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 2,
        maxUploadMb: 5,
    },
    {
        id: 'onedrive',
        name: 'OneDrive',
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 2,
        maxUploadMb: 5,
    },
    {
        id: 'osfstorage',
        name: 'OSF Storage',
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: true,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 2,
        maxUploadMb: 5,
    },
    {
        id: 'owncloud',
        name: 'ownCloud',
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: false,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 2,
        maxUploadMb: 5,
    },
    {
        id: 's3',
        name: 'Amazon S3',
        readOnly: false,
        supportsCopy: true,
        supportsUserSpecificRootFolder: false,
        supportsFileVersioning: false,
        supportsBulkDownload: true,
        maxConcurrentDownloads: 2,
        maxUploadMb: 5,
    },
];
