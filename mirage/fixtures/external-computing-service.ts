import { CredentialsFormat, TermsOfServiceCapabilities } from 'ember-osf-web/models/external-service';

export default [
    {
        id: 'boa',
        name: 'Boa',
        credentialsFormat: CredentialsFormat.USERNAME_PASSWORD,
        termsOfService: [
            TermsOfServiceCapabilities.ADD_UPDATE_FILES_PARTIAL,
            TermsOfServiceCapabilities.FORKING_PARTIAL,
            TermsOfServiceCapabilities.LOGS_PARTIAL,
            TermsOfServiceCapabilities.PERMISSIONS_PARTIAL,
            TermsOfServiceCapabilities.REGISTERING_PARTIAL,
        ],
        iconUrl: 'https://boa.cs.iastate.edu/img/boa-white.png',
    },
];
