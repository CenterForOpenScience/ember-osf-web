import { CredentialsFormat } from 'ember-osf-web/models/external-service';
export default [
    {
        id: 'dataverse',
        displayName: 'Dataverse',
        credentialsFormat: CredentialsFormat.OAUTH2,
        iconUrl: 'https://dataverse.org/logo.png',
    },
];
