/* eslint-disable max-len */
import { CredentialsFormat } from 'ember-osf-web/models/external-service';
export default [
    {
        id: 'datapipe',
        displayName: 'DataPipe',
        credentialsFormat: CredentialsFormat.OAUTH2,
        redirectUrl: 'https://pipe.jspsych.org/',
        iconUrl: 'https://pipe.jspsych.org/logo.png',
    },
];
