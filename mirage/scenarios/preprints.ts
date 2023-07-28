import { ModelInstance, Server } from 'ember-cli-mirage';

import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import User from 'ember-osf-web/models/user';

export function preprintsScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const thesisCommons = server.schema.preprintProviders.find('thesiscommons') as ModelInstance<PreprintProvider>;
    const brand = server.create('brand', {
        primaryColor: '#821e1e',
        secondaryColor: '#94918e',
        heroBackgroundImage: 'https://singlecolorimage.com/get/94918e/1000x1000',
    });
    const currentUserModerator = server.create('moderator',
        { id: currentUser.id, user: currentUser, provider: thesisCommons }, 'asAdmin');

    const preprints = server.createList('preprint', 3, {
        provider: thesisCommons,
    });
    thesisCommons.update({
        brand,
        moderators: [currentUserModerator],
        preprints,
        description: '<p style="color: red">This is the description for Thesis Commons and it has an inline-style!</p>',
    });
}
