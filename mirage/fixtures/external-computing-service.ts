import { CredentialsFormat, ExternalServiceCapabilities } from 'ember-osf-web/models/external-service';

export default [
    {
        id: 'boa',
        displayName: 'Boa',
        credentialsFormat: CredentialsFormat.USERNAME_PASSWORD,
        termsOfService: [
            ExternalServiceCapabilities.ADD_UPDATE_FILES_PARTIAL,
            ExternalServiceCapabilities.FORKING_PARTIAL,
            ExternalServiceCapabilities.LOGS_PARTIAL,
            ExternalServiceCapabilities.PERMISSIONS_PARTIAL,
            ExternalServiceCapabilities.REGISTERING_PARTIAL,
        ],
        iconUrl: 'https://boa.cs.iastate.edu/img/boa-white.png',
    },
];
