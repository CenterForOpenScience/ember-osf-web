import { CredentialsFormat } from 'ember-osf-web/models/external-storage-service';

export default [
    {
        id: 'boa',
        name: 'Boa',
        credentialsFormat: CredentialsFormat.USERNAME_PASSWORD,
        links: {
            icon: 'https://boa.cs.uchicago.edu/favicon.ico',
        },
    },
];
