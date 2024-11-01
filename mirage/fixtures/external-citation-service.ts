import { CredentialsFormat, TermsOfServiceCapabilities } from 'ember-osf-web/models/external-service';

export default [
    {
        id: 'mendeley',
        displayName: 'Mendeley',
        credentialsFormat: CredentialsFormat.OAUTH2,
        supportedFeatures: [
            TermsOfServiceCapabilities.FORKING_PARTIAL,
            TermsOfServiceCapabilities.PERMISSIONS_PARTIAL,
        ],
        iconUrl: 'https://osf.io/static/addons/mendeley/comicon.png',
    },
    {
        id: 'zotero',
        displayName: 'Zotero',
        credentialsFormat: CredentialsFormat.OAUTH,
        supportedFeatures: [
            TermsOfServiceCapabilities.FORKING_PARTIAL,
            TermsOfServiceCapabilities.PERMISSIONS_PARTIAL,
        ],
        iconUrl: 'https://zbib.org/static/favicon.ico',
    },
];
