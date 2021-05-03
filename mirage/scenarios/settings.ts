import { ModelInstance, Server } from 'ember-cli-mirage';

import User from 'ember-osf-web/models/user';

export function settingsScenario(server: Server, currentUser: ModelInstance<User>) {
    server.create('user-setting', { user: currentUser });
    server.createList('token', 23);
    server.createList('scope', 5);
    server.createList('developer-app', 12);
    server.create('external-identity', { id: 'ORCID' }, 'withStatusVerified');
    server.createList('external-identity', 10);
}
