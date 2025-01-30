import { CredentialsFormat, ExternalServiceCapabilities } from 'ember-osf-web/models/external-service';

export default [
    {
        id: 'mendeley',
        displayName: 'Mendeley',
        credentialsFormat: CredentialsFormat.OAUTH2,
        supportedFeatures: [
            ExternalServiceCapabilities.FORKING_PARTIAL,
            ExternalServiceCapabilities.PERMISSIONS_PARTIAL,
        ],
        iconUrl: 'https://osf.io/static/addons/mendeley/comicon.png',
    },
    {
        id: 'zotero',
        displayName: 'Zotero',
        credentialsFormat: CredentialsFormat.OAUTH,
        supportedFeatures: [
            ExternalServiceCapabilities.FORKING_PARTIAL,
            ExternalServiceCapabilities.PERMISSIONS_PARTIAL,
        ],
        iconUrl: 'https://zbib.org/static/favicon.ico',
    },
];
