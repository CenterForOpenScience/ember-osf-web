import { ModelInstance, Server } from 'ember-cli-mirage';

import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import User from 'ember-osf-web/models/user';

export function preprintsScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const thesisCommons = server.schema.preprintProviders.find('thesiscommons') as ModelInstance<PreprintProvider>;
    const brand = server.create('brand');
    const currentUserModerator = server.create('moderator',
        { id: currentUser.id, user: currentUser, provider: thesisCommons }, 'asAdmin');

    const preprints = server.createList('preprint', 3, {
        provider: thesisCommons,
    });

    const subjects = server.createList('subject', 2);

    thesisCommons.update({
        highlightedSubjects: subjects,
        brand,
        moderators: [currentUserModerator],
        preprints,
        description: '<p style="color: red">This is the description for Thesis Commons and it has an inline-style!</p>',
    });
}
