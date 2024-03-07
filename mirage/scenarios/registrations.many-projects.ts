import { ModelInstance, Server } from 'ember-cli-mirage';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

import { draftRegisterNodeMultiple, registerNodeMultiple } from '../helpers';

export function registrationsManyProjectsScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const registrationNode = server.create(
        'node',
        {
            id: 'regis', currentUserPermissions: Object.values(Permission),
        },
        'withContributors',
    );
    server.create('contributor', {
        node: registrationNode,
        users: currentUser,
        permission: Permission.Admin,
        index: 0,
    });

    registerNodeMultiple(
        server,
        registrationNode,
        12,
        { currentUserPermissions: Object.values(Permission) },
        'withArbitraryState',
    );
    draftRegisterNodeMultiple(server, registrationNode, 12, {}, 'withRegistrationMetadata');
}
