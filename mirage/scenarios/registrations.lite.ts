import { ModelInstance, Server } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';

export function registrationsLiteScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const { defaultProvider } = config;

    server.create('registration-provider', {
        id: defaultProvider,
        brandedDiscoveryPage: false,
        shareSource: 'OSF Registries',
        name: 'OSF Registries',
    }, 'withAllSchemas');

    createDecafRegistration(server, currentUser);
}

/**
 * createBeefsRegistration
 *
 * @description Create the Beefs Registration
 *
 * @param server The server param
 * @param currentUser The current User
 */
function createDecafRegistration(server: Server, currentUser: ModelInstance<User>): void {
    const egap = server.create('registration-provider', { id: 'egap', name: 'EGAP' },
        'withBrand', 'currentUserIsModerator');
    server.create('moderator', { provider: egap });
    server.create('moderator', { id: currentUser.id, user: currentUser, provider: egap }, 'asAdmin');
    server.createList('moderator', 5, { provider: egap });

    const decaf = server.create('registration', {
        id: 'decaf',
        title: 'Pending Penguins',
        registrationSchema: server.schema.registrationSchemas.find('testSchema'),
        provider: egap,
        reviewsState: RegistrationReviewStates.Accepted,
        registeredBy: currentUser,
        revisionState: RevisionReviewStates.RevisionPendingModeration,
        currentUserPermissions: Object.values(Permission),
        providerSpecificMetadata: [
            { field_name: 'EGAP Registration ID', field_value: '' },
            { field_name: 'Another Field', field_value: 'aloha' },
        ],
        registrationResponses: {
            'page-one_long-text': 'aaaaa',
            'page-one_multi-select': ['Crocs'],
        },
        hasData: false,
        hasMaterials: true,
        hasAnalyticCode: false,
        hasPapers: true,
        hasSupplements: false,
    }, 'withContributors', 'withReviewActions', 'withFiles');

    server.create('contributor', { users: currentUser, node: decaf });
    server.create('contributor', { node: decaf }, 'unregistered');
}
