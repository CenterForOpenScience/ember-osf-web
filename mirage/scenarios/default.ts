import { Server } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import {
    collectionScenario,
    collectionModerationScenario,
} from './collections';
import { dashboardScenario } from './dashboard';
import { forksScenario } from './forks';
import { meetingsScenario } from './meetings';
import { preprintsScenario } from './preprints';
import { cedarMetadataRecordsScenario } from './cedar-metatdata-record';
import { registrationFullScenario as registrationsFullScenario } from './registrations.full';
import { settingsScenario } from './settings';
import { registrationsLiteScenario } from './registrations.lite';
import { registrationsManyProjectsScenario} from './registrations.many-projects';

const {
    mirageScenarios,
} = config;

export default function(server: Server) {
    server.loadFixtures('schema-blocks');
    server.loadFixtures('registration-schemas');
    server.loadFixtures('regions');
    server.loadFixtures('cedar-metadata-templates');
    server.loadFixtures('preprint-providers');
    server.loadFixtures('licenses');
    server.loadFixtures('external-storage-services');
    server.loadFixtures('external-computing-services');
    server.loadFixtures('external-citation-services');
    // server.loadFixtures('registration-providers');

    // load citations for preprints, registrations, or manyProjectRegistrations
    if (mirageScenarios.some(s => ['preprints', 'manyProjectRegistrations', 'registrations'].includes(s))) {
        server.loadFixtures('citation-styles');
    }

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
    if (mirageScenarios.includes('registrations::lite')) {
        registrationsLiteScenario(server, currentUser);
    }
    if (mirageScenarios.includes('registrations::full')) {
        registrationsFullScenario(server, currentUser);
    }
    if (mirageScenarios.includes('registrations::many-projects')) {
        registrationsManyProjectsScenario(server, currentUser);
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
    if (mirageScenarios.includes('preprints')) {
        preprintsScenario(server, currentUser);
    }

    if (mirageScenarios.includes('cedar')) {
        cedarMetadataRecordsScenario(server);
    }
}
