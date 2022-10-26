import { Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import {
    collectionScenario,
    collectionModerationScenario,
} from './collections';
import { dashboardScenario } from './dashboard';
import { forksScenario } from './forks';
import { meetingsScenario } from './meetings';
import { manyProjectRegistrationsScenario, registrationScenario } from './registrations';
import { settingsScenario } from './settings';

const {
    mirageScenarios,
} = config;

export default function(server: Server) {
    server.loadFixtures('schema-blocks');
    server.loadFixtures('registration-schemas');
    server.loadFixtures('regions');
    server.loadFixtures('preprint-providers');
    server.loadFixtures('licenses');
    // server.loadFixtures('registration-providers');

    const userTraits = !mirageScenarios.includes('loggedIn') ? []
        : [
            'loggedIn',
            'withInstitutions',
            'withSettings',
            'withAlternateEmail',
            'withUnconfirmedEmail',
        ];
    const currentUser = server.create('user', ...userTraits);

    // Optional Scenarios
    if (mirageScenarios.includes('dashboard')) {
        dashboardScenario(server, currentUser);
    }
    if (mirageScenarios.includes('registrations')) {
        registrationScenario(server, currentUser);
    }
    if (mirageScenarios.includes('collections')) {
        collectionScenario(server, currentUser);
        collectionModerationScenario(server, currentUser);
    }
    if (mirageScenarios.includes('forks')) {
        forksScenario(server, currentUser);
    }
    if (mirageScenarios.includes('settings')) {
        settingsScenario(server, currentUser);
    }
    if (mirageScenarios.includes('meetings')) {
        meetingsScenario(server);
    }
    if (mirageScenarios.includes('manyProjectRegistrations')) {
        manyProjectRegistrationsScenario(server, currentUser);
    }
}
