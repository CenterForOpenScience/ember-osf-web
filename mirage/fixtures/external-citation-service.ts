import { CredentialsFormat, TermsOfServiceCapabilities } from 'ember-osf-web/models/external-storage-service';

export default [
    {
        id: 'mendeley',
        name: 'Mendeley',
        credentialsFormat: CredentialsFormat.OAUTH2,
        termsOfService: [
            TermsOfServiceCapabilities.FORKING_PARTIAL,
            TermsOfServiceCapabilities.PERMISSIONS_PARTIAL,
            TermsOfServiceCapabilities.REGISTERING_PARTIAL,
        ],
        iconUrl: 'https://osf.io/static/addons/mendeley/comicon.png',
    },
    {
        id: 'zotero',
        name: 'Zotero',
        credentialsFormat: CredentialsFormat.OAUTH,
        termsOfService: [
            TermsOfServiceCapabilities.FORKING_PARTIAL,
            TermsOfServiceCapabilities.PERMISSIONS_PARTIAL,
            TermsOfServiceCapabilities.REGISTERING_PARTIAL,
        ],
        iconUrl: 'https://zbib.org/static/favicon.ico',
    },
];
