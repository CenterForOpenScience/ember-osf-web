import { CredentialsFormat, TermsOfServiceCapabilities } from 'ember-osf-web/models/external-service';

export default [
    {
        id: 'mendeley',
        displayName: 'Mendeley',
        credentialsFormat: CredentialsFormat.OAUTH2,
        termsOfService: [
            TermsOfServiceCapabilities.FORKING_PARTIAL,
            TermsOfServiceCapabilities.PERMISSIONS_PARTIAL,
        ],
        iconUrl: 'https://osf.io/static/addons/mendeley/comicon.png',
    },
    {
        id: 'zotero',
        displayName: 'Zotero',
        credentialsFormat: CredentialsFormat.OAUTH,
        termsOfService: [
            TermsOfServiceCapabilities.FORKING_PARTIAL,
            TermsOfServiceCapabilities.PERMISSIONS_PARTIAL,
        ],
        iconUrl: 'https://zbib.org/static/favicon.ico',
    },
];
